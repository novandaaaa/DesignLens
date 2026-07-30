import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';

interface MentionEditorProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  placeholder?: string;
}

export default function MentionEditor({ value, onChange, onSubmit, submitting, placeholder }: MentionEditorProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [users, setUsers] = useState<{ id: string; name: string; avatar?: string }[]>([]);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPos, setCursorPos] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (mentionQuery.length >= 2) {
        try {
          const results = await api.searchUsers(mentionQuery);
          setUsers(results);
          setShowDropdown(true);
        } catch (e) {
          console.error(e);
        }
      } else {
        setShowDropdown(false);
      }
    };
    
    const timeoutId = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [mentionQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);
    
    const cursor = e.target.selectionStart;
    setCursorPos(cursor);
    
    // Check if we are typing a mention
    const textBeforeCursor = val.slice(0, cursor);
    const match = textBeforeCursor.match(/@(\w*)$/);
    
    if (match) {
      setMentionQuery(match[1]);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectUser = (user: any) => {
    const textBeforeCursor = value.slice(0, cursorPos);
    const textAfterCursor = value.slice(cursorPos);
    
    // Replace the @query with @[Name](id)
    const newTextBefore = textBeforeCursor.replace(/@\w*$/, `@[${user.name}](${user.id}) `);
    
    onChange(newTextBefore + textAfterCursor);
    setShowDropdown(false);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative mb-8">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder || "Tulis komentar atau feedback Anda..."}
        rows={3}
        className="w-full px-4 py-3 cyber-cut bg-surface-100 border placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-[#8A2BE1]/50 focus:border-[#8A2BE1] transition-all resize-none"
      />
      
      {showDropdown && users.length > 0 && (
        <div className="absolute z-50 left-0 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-50" style={{ top: 'calc(100% - 40px)' }}>
          {users.map(u => (
            <button
              key={u.id}
              type="button"
              onClick={() => handleSelectUser(u)}
              className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center gap-3 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#8A2BE1]/20 flex items-center justify-center text-xs">
                {u.name.charAt(0)}
              </div>
              <span className="text-sm">{u.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-end mt-2">
        <button
          type="submit"
          data-cursor-target="true"
          disabled={submitting || !value.trim()}
          className="cursor-target px-5 py-2 cyber-cut bg-[#8A2BE1] text-white text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {submitting ? 'Mengirim...' : 'Kirim Komentar'}
        </button>
      </div>
    </form>
  );
}
