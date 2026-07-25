'use client';

import Link from 'next/link';
import { useEffect, useState, use, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function CommunityPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await api.addComment(id, comment);
      setComment('');
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

  const handleLike = async (commentId: string) => {
    try {
      await api.toggleLike(commentId);
      loadPost();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen">
      <nav className="border-b border-border bg-surface-0/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link href="/community" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Community
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Post Header */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
              {post.website?.user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-text-primary">{post.website?.user?.name}</div>
              <div className="text-xs text-text-tertiary">
                {new Date(post.publishedAt).toLocaleDateString('id-ID', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-2">{post.website?.title}</h1>
          <a href={post.website?.url} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline text-sm">
            {post.website?.url} ↗
          </a>
          {post.website?.description && (
            <p className="text-text-secondary mt-3 leading-relaxed">{post.website.description}</p>
          )}
          <div className="flex gap-3 mt-4">
            <span className="px-3 py-1 rounded-lg bg-brand-500/10 text-brand-400 text-xs font-medium">
              {post.website?.category?.name}
            </span>
            <span className="text-sm text-text-tertiary">💬 {post._count?.comments ?? 0} komentar</span>
          </div>
        </div>

        {/* Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tulis komentar atau feedback Anda..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-surface-100 border placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="px-5 py-2 rounded-xl bg-linear-to-r from-brand-500 to-purple-500 text-white text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? 'Mengirim...' : 'Kirim Komentar'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 rounded-xl bg-surface-100 border border-border text-center">
            <p className="text-text-secondary text-sm">
              <Link href="/login" className="text-brand-400 hover:underline">Masuk</Link> untuk memberikan komentar
            </p>
          </div>
        )}

        {/* Comments */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-text-primary">Komentar ({post._count?.comments ?? 0})</h2>
          
          {(!post.comments || post.comments.length === 0) ? (
            <p className="text-text-tertiary text-sm py-4">Belum ada komentar. Jadilah yang pertama!</p>
          ) : (
            post.comments.map((cmt: any) => (
              <div key={cmt.id} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-surface-200 flex items-center justify-center text-xs font-bold text-text-secondary">
                    {cmt.user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-text-primary">{cmt.user?.name}</span>
                  <span className="text-xs text-text-tertiary">
                    {new Date(cmt.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed ml-9">{cmt.content}</p>

                <div className="flex items-center gap-4 ml-9 mt-3">
                  {isAuthenticated && (
                    <>
                      <button
                        onClick={() => handleLike(cmt.id)}
                        className="text-xs text-text-tertiary hover:text-brand-400 transition-colors flex items-center gap-1"
                      >
                        ❤️ {cmt._count?.likes ?? 0}
                      </button>
                      <button
                        onClick={() => setReplyingTo(replyingTo === cmt.id ? null : cmt.id)}
                        className="text-xs text-text-tertiary hover:text-brand-400 transition-colors"
                      >
                        Balas
                      </button>
                    </>
                  )}
                </div>

                {/* Reply Form */}
                {replyingTo === cmt.id && (
                  <div className="ml-9 mt-3 flex gap-2">
                    <input
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Tulis balasan..."
                      className="flex-1 px-3 py-2 rounded-lg bg-surface-100 border border-border text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-brand-500/50"
                    />
                    <button
                      onClick={() => handleReply(cmt.id)}
                      disabled={submitting}
                      className="px-4 py-2 rounded-lg bg-brand-500 text-white text-xs font-medium"
                    >
                      Balas
                    </button>
                  </div>
                )}

                {/* Replies */}
                {cmt.replies && cmt.replies.length > 0 && (
                  <div className="ml-9 mt-3 space-y-3 pl-4 border-l-2 border-border">
                    {cmt.replies.map((reply: any) => (
                      <div key={reply.id}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-5 h-5 rounded-full bg-surface-200 flex items-center justify-center text-[10px] font-bold text-text-secondary">
                            {reply.user?.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="text-xs font-medium text-text-primary">{reply.user?.name}</span>
                          <span className="text-xs text-text-tertiary">
                            {new Date(reply.createdAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary ml-7">{reply.content}</p>
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
  );
}
