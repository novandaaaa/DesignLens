'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import ReactionPicker from '@/components/ReactionPicker';
import MentionEditor from '@/components/MentionEditor';
import ScreenshotAnnotator from '@/components/ScreenshotAnnotator';
import Image from 'next/image';

export default function CommunityPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated, user, logout } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [comment, setComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  
  // Anchor Pin State
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [newPin, setNewPin] = useState<{ xPct: number; yPct: number } | null>(null);

  // Author Options State
  const [showOptions, setShowOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ title: '', description: '', targetAudience: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);

  const loadPost = useCallback(async () => {
    try {
      const data = await api.getCommunityPost(id);
      setPost(data);
    } catch (error) {
      console.error('Failed to load post:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPost();
  }, [loadPost]);

  const isAuthor = user?.id && post?.website?.user?.id === user?.id;

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.updateCommunityPost(id, editData);
      setShowEditModal(false);
      loadPost();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm('Yakin ingin membatalkan publikasi post ini? Website akan kembali ke Draft.')) return;
    setIsUnpublishing(true);
    try {
      await api.unpublishCommunityPost(id);
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.message);
      setIsUnpublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus post ini dari komunitas secara permanen?')) return;
    setIsDeleting(true);
    try {
      await api.deleteCommunityPost(id);
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.message);
      setIsDeleting(false);
    }
  };

  const handleAddPin = (xPct: number, yPct: number) => {
    setNewPin({ xPct, yPct });
    setSelectedPinId(null);
    // Focus the main comment editor automatically
  };

  const handleSelectComment = (commentId: string) => {
    setSelectedPinId(commentId);
    setNewPin(null);
    
    // Scroll to comment in sidebar
    const el = document.getElementById(`comment-${commentId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('bg-white/10');
      setTimeout(() => el.classList.remove('bg-white/10'), 2000);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const screenshotId = post.website?.screenshots?.[0]?.id;
      await api.addComment(id, comment, newPin?.xPct, newPin?.yPct, screenshotId);
      setComment('');
      setNewPin(null);
      loadPost();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      await api.replyComment(commentId, replyText);
      setReplyText('');
      setReplyingTo(null);
      loadPost();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to parse mention text format @[Name](id) for display
  const renderCommentContent = (content: string) => {
    const parts = content.split(/(@\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      const match = part.match(/@\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <Link key={i} href={`/profile/${match[2]}`} className="text-[#8A2BE1] hover:underline font-medium">
            @{match[1]}
          </Link>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#8A2BE1] border-t-transparent cyber-cut-sm animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  const screenshotUrl = post.website?.screenshots?.[0]?.fileUrl;

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative z-10 flex flex-col">
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-500">
        <div className="mx-auto px-6 py-3.5 rounded-2xl backdrop-blur-2xl border border-[#F9F9FD]/10 bg-[#0A0A0A]/60 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between gap-6">
            <Link href="/" data-cursor-target="true" className="cursor-target flex items-center gap-3 group shrink-0">
              <Image 
                src="/logo_DesignLens.png" 
                alt="DesignLens Logo"
                width={40}
                height={40}
                className="object-contain transition-transform duration-300 group-hover:scale-110 shrink-0 mix-blend-screen"
                priority
              />
              <span className="text-2xl font-bold text-[#8A2BE1] hidden sm:block">DesignLens</span>
            </Link>

            <div className="flex items-center gap-4 shrink-0">
              <Link href="/dashboard" data-cursor-target="true" className="cursor-target text-sm text-[#F9F9FD]/70 hover:text-[#F9F9FD] transition-colors hidden sm:block">
                Dashboard
              </Link>
              {isAuthenticated ? (
                <>
                  <div className="h-6 w-px bg-[#F9F9FD]/10 hidden sm:block" />
                  <div className="flex items-center gap-3">
                    <Link href={`/profile/${user?.id}`} className="cursor-target flex items-center gap-3 group/profile">
                      <div className="w-9 h-9 rounded-xl bg-[#8A2BE1]/20 border border-[#8A2BE1]/40 flex items-center justify-center text-[#8A2BE1] text-sm font-bold shadow-lg shadow-[#8A2BE1]/10 group-hover/profile:border-[#8A2BE1] transition-all">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="text-sm text-[#F9F9FD] font-medium hidden sm:block group-hover/profile:text-white transition-colors">{user?.name}</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="cursor-target text-xs text-[#F9F9FD]/50 hover:text-red-400 transition-colors ml-2"
                    >
                      Keluar
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 cyber-cut bg-[#8A2BE1] text-[#F9F9FD] text-sm font-medium hover:-translate-y-0.5 transition-transform"
                >
                  Masuk
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto w-full px-6 pt-32 pb-24 flex flex-col lg:flex-row gap-8">
        {/* Left Side: Screenshot & Details */}
        <div className="flex-1">
          <Link href="/community" data-cursor-target="true" className="cursor-target inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Kembali ke Komunitas
          </Link>

          {/* Post Header */}
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 cyber-cut-sm bg-[#8A2BE1] flex items-center justify-center text-white text-sm font-bold">
                  {post.website?.user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <Link href={`/profile/${post.website?.user?.id}`} className="font-medium text-text-primary hover:underline">
                    {post.website?.user?.name}
                  </Link>
                  <div className="text-xs text-text-tertiary">
                    {new Date(post.publishedAt).toLocaleDateString('id-ID', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
              
              {isAuthor && (
                <div className="relative">
                  <button 
                    onClick={() => setShowOptions(!showOptions)}
                    className="p-2 text-text-secondary hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </button>
                  {showOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                      <button 
                        onClick={() => { setShowOptions(false); setEditData({ title: post.website.title, description: post.website.description || '', targetAudience: post.website.targetAudience || '' }); setShowEditModal(true); }}
                        className="w-full text-left px-4 py-3 text-sm text-[#F9F9FD] hover:bg-white/5 transition-colors flex items-center gap-2"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit Post
                      </button>
                      <button 
                        onClick={() => { setShowOptions(false); handleUnpublish(); }}
                        disabled={isUnpublishing}
                        className="w-full text-left px-4 py-3 text-sm text-yellow-400 hover:bg-white/5 transition-colors flex items-center gap-2"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l18 18M10.584 10.587a2 2 0 002.828 2.83M17 17H5a2 2 0 01-2-2V7a2 2 0 011.5-1.921M15 5h2a2 2 0 012 2v6.5"/></svg>
                        Tarik dari Komunitas
                      </button>
                      <button 
                        onClick={() => { setShowOptions(false); handleDelete(); }}
                        disabled={isDeleting}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors flex items-center gap-2"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        Hapus Post
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold text-text-primary mb-2">{post.website?.title}</h1>
            <a href={post.website?.url} target="_blank" rel="noopener noreferrer" data-cursor-target="true" className="cursor-target text-[#C5ABF2] hover:underline text-sm">
              {post.website?.url} ↗
            </a>
            {post.website?.description && (
              <p className="text-text-secondary mt-3 leading-relaxed">{post.website.description}</p>
            )}
            <div className="flex gap-3 mt-4">
              <span className="px-3 py-1 rounded-lg bg-[#8A2BE1]/10 text-[#C5ABF2] text-xs font-medium">
                {post.website?.category?.name}
              </span>
            </div>
          </div>

          {screenshotUrl && (
            <div className="mb-6">
              <div className="text-sm text-text-secondary mb-2 flex items-center justify-between">
                <span>Klik area gambar untuk memberi komentar spesifik.</span>
                {newPin && (
                  <button onClick={() => setNewPin(null)} className="text-red-400 hover:underline text-xs">
                    Batal Pin
                  </button>
                )}
              </div>
              <ScreenshotAnnotator 
                screenshotUrl={screenshotUrl} 
                comments={post.comments} 
                onAddPin={handleAddPin}
                onSelectComment={handleSelectComment}
                selectedPinId={selectedPinId}
              />
            </div>
          )}
        </div>

        {/* Right Side: Comments */}
        <div className="w-full lg:w-112.5 flex flex-col">
          {/* Comment Form */}
          {isAuthenticated ? (
            <div className="mb-6 relative">
              {newPin && (
                <div className="absolute -top-3 left-4 bg-[#8A2BE1] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
                  📍 Pin ditambahkan (X: {Math.round(newPin.xPct)}%, Y: {Math.round(newPin.yPct)}%)
                </div>
              )}
              <MentionEditor 
                value={comment}
                onChange={setComment}
                onSubmit={handleComment}
                submitting={submitting}
                placeholder={newPin ? "Berikan komentar pada area yang ditandai..." : "Tulis komentar atau feedback Anda..."}
              />
            </div>
          ) : (
            <div className="mb-8 p-4 cyber-cut bg-surface-100 border border-border text-center">
              <p className="text-text-secondary text-sm">
                <Link href="/login" data-cursor-target="true" className="cursor-target text-[#C5ABF2] hover:underline">Masuk</Link> untuk memberikan komentar
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4 overflow-y-auto max-h-[80vh] pr-2 custom-scrollbar">
            <h2 className="text-lg font-bold text-text-primary sticky top-0 bg-surface-0/90 py-2 z-10">
              Komentar ({post._count?.comments ?? 0})
            </h2>
            
            {(!post.comments || post.comments.length === 0) ? (
              <p className="text-text-tertiary text-sm py-4">Belum ada komentar. Jadilah yang pertama!</p>
            ) : (
              post.comments.map((cmt: any) => (
                <div 
                  key={cmt.id} 
                  id={`comment-${cmt.id}`}
                  className={`glass-card p-5 transition-colors duration-500 ${
                    selectedPinId === cmt.id ? 'border-[#8A2BE1] bg-[#8A2BE1]/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 cyber-cut-sm bg-surface-200 flex items-center justify-center text-xs font-bold text-text-secondary">
                      {cmt.user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <Link href={`/profile/${cmt.userId}`} className="text-sm font-medium text-text-primary hover:underline">
                      {cmt.user?.name}
                    </Link>
                    {cmt.user?.specializations?.[0] && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                        {cmt.user.specializations[0]}
                      </span>
                    )}
                    <span className="text-xs text-text-tertiary ml-auto">
                      {new Date(cmt.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  
                  {cmt.xPct !== null && (
                    <div className="text-[10px] text-[#8A2BE1] mb-1 font-medium">📍 Komentar ber-pin</div>
                  )}
                  
                  <p className="text-sm text-text-secondary leading-relaxed ml-9">
                    {renderCommentContent(cmt.content)}
                  </p>

                  <div className="flex items-center gap-4 ml-9 mt-3">
                    <ReactionPicker 
                      commentId={cmt.id} 
                      reactionCounts={cmt.reactionCounts} 
                      userReaction={cmt.userReaction} 
                      onReact={loadPost} 
                    />
                    
                    {isAuthenticated && (
                      <button
                        onClick={() => setReplyingTo(replyingTo === cmt.id ? null : cmt.id)}
                        className="text-xs text-text-tertiary hover:text-[#C5ABF2] transition-colors"
                      >
                        Balas
                      </button>
                    )}
                  </div>

                  {/* Reply Form */}
                  {replyingTo === cmt.id && (
                    <div className="ml-9 mt-4">
                      <MentionEditor 
                        value={replyText}
                        onChange={setReplyText}
                        onSubmit={(e) => { e.preventDefault(); handleReply(cmt.id); }}
                        submitting={submitting}
                        placeholder="Tulis balasan..."
                      />
                    </div>
                  )}

                  {/* Replies */}
                  {cmt.replies && cmt.replies.length > 0 && (
                    <div className="ml-9 mt-3 space-y-3 pl-4 border-l-2 border-border">
                      {cmt.replies.map((reply: any) => (
                        <div key={reply.id}>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 cyber-cut-sm bg-surface-200 flex items-center justify-center text-[10px] font-bold text-text-secondary">
                              {reply.user?.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <Link href={`/profile/${reply.userId}`} className="text-xs font-medium text-text-primary hover:underline">
                              {reply.user?.name}
                            </Link>
                            <span className="text-xs text-text-tertiary ml-auto">
                              {new Date(reply.createdAt).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary ml-7">
                            {renderCommentContent(reply.content)}
                          </p>
                          <div className="ml-7 mt-2">
                            <ReactionPicker 
                              commentId={reply.id} 
                              reactionCounts={reply.reactionCounts} 
                              userReaction={reply.userReaction} 
                              onReact={loadPost} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI Review Results */}
      {post.website?.aiReview && post.website.aiReview.status === 'COMPLETED' && (
        <div className="max-w-7xl mx-auto px-6 pb-20 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            Hasil AI Review
          </h2>
          <div className="space-y-6">
            <div className="p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center gap-8">
              <div className="relative shrink-0">
                <svg width="120" height="120" className="-rotate-90">
                  <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/10" />
                  <circle
                    cx="60" cy="60" r="56" fill="none" 
                    stroke={post.website.aiReview.overallScore >= 80 ? '#10b981' : post.website.aiReview.overallScore >= 60 ? '#f59e0b' : '#ef4444'} 
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 56} 
                    strokeDashoffset={(2 * Math.PI * 56) - ((post.website.aiReview.overallScore ?? 0) / 100) * (2 * Math.PI * 56)} 
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{post.website.aiReview.overallScore}</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Overall Score</h3>
                <p className="text-white/70 text-base">
                  {post.website.aiReview.overallScore >= 80 ? 'Desain website Anda sudah sangat baik! 🎉' :
                   post.website.aiReview.overallScore >= 60 ? 'Cukup baik, ada beberapa area yang bisa ditingkatkan.' :
                   'Masih ada banyak ruang untuk perbaikan.'}
                </p>
                <p className="text-xs text-white/40 mt-3 font-mono">Model: {post.website.aiReview.modelUsed}</p>
              </div>
            </div>

            {post.website.aiReview.recommendation && (
              <div className="p-6 rounded-2xl border border-white/5 bg-[#8A2BE1]/10 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">💡</span>
                  <h4 className="font-bold text-white text-lg">Rekomendasi Utama</h4>
                </div>
                <p className="text-white/80 leading-relaxed">{post.website.aiReview.recommendation}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Edit Postingan Komunitas</h2>
            <form onSubmit={handleUpdatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Judul Website</label>
                <input 
                  type="text" 
                  value={editData.title} 
                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#8A2BE1]" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Deskripsi</label>
                <textarea 
                  value={editData.description} 
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#8A2BE1] h-32 resize-none" 
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="px-6 py-2 rounded-lg bg-[#8A2BE1] text-white hover:bg-[#8A2BE1]/90 disabled:opacity-50 transition-colors">
                  {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
