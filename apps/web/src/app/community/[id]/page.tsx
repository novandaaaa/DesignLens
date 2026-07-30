'use client';

import Link from 'next/link';
import { useEffect, useState, use, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import ReactionPicker from '@/components/ReactionPicker';
import MentionEditor from '@/components/MentionEditor';
import ScreenshotAnnotator from '@/components/ScreenshotAnnotator';

export default function CommunityPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [comment, setComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Anchor Pin State
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [newPin, setNewPin] = useState<{ xPct: number; yPct: number } | null>(null);

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
    <div className="min-h-screen">
      <nav className="border-b border-white/5 bg-surface-0/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" data-cursor-target="true" className="cursor-target flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#8A2BE1] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">
              Design<span className="text-[#8A2BE1]">Lens</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard" data-cursor-target="true" className="cursor-target text-sm text-white/60 hover:text-white transition-colors">
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 cyber-cut bg-[#8A2BE1] text-white text-sm font-medium"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
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
            <div className="flex items-center gap-3 mb-4">
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
    </div>
  );
}
