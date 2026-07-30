import { useState } from 'react';
import { api } from '@/lib/api';

interface ReactionPickerProps {
  commentId: string;
  reactionCounts: Record<string, number> | null;
  userReaction: any;
  onReact: () => void;
}

export default function ReactionPicker({ commentId, reactionCounts, userReaction, onReact }: ReactionPickerProps) {
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleReact = async (type: 'AGREE' | 'NEEDS_REVIEW' | 'DISAGREE') => {
    setLoading(true);
    try {
      await api.reactToComment(commentId, type);
      onReact(); // Trigger reload
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setShowPicker(false);
    }
  };

  const getEmoji = (type: string) => {
    if (type === 'AGREE') return '👍 Setuju';
    if (type === 'NEEDS_REVIEW') return '🤔 Perlu Dipertimbangkan';
    if (type === 'DISAGREE') return '👎 Kurang Setuju';
    return '';
  };

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowPicker(!showPicker)}
          disabled={loading}
          className={`text-xs px-2 py-1 rounded-md transition-colors border ${
            userReaction 
              ? 'bg-[#8A2BE1]/20 border-[#8A2BE1]/50 text-[#C5ABF2]' 
              : 'border-border text-text-tertiary hover:border-white/20 hover:text-white'
          }`}
        >
          {userReaction ? getEmoji(userReaction.type) : 'Berikan Reaksi'}
        </button>

        {reactionCounts === null ? (
          <span className="text-[10px] italic text-text-tertiary">
            (Beri reaksi untuk melihat hasil)
          </span>
        ) : (
          <div className="flex gap-2 text-[10px] text-text-secondary">
            {reactionCounts.AGREE > 0 && <span>👍 {reactionCounts.AGREE}</span>}
            {reactionCounts.NEEDS_REVIEW > 0 && <span>🤔 {reactionCounts.NEEDS_REVIEW}</span>}
            {reactionCounts.DISAGREE > 0 && <span>👎 {reactionCounts.DISAGREE}</span>}
          </div>
        )}
      </div>

      {showPicker && (
        <div className="absolute top-full mt-1 left-0 z-10 flex flex-col bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-45">
          <button onClick={() => handleReact('AGREE')} className="px-3 py-2 text-xs text-left hover:bg-white/5 transition-colors">
            👍 Setuju
          </button>
          <button onClick={() => handleReact('NEEDS_REVIEW')} className="px-3 py-2 text-xs text-left hover:bg-white/5 transition-colors">
            🤔 Perlu Dipertimbangkan
          </button>
          <button onClick={() => handleReact('DISAGREE')} className="px-3 py-2 text-xs text-left hover:bg-white/5 transition-colors">
            👎 Kurang Setuju
          </button>
        </div>
      )}
    </div>
  );
}
