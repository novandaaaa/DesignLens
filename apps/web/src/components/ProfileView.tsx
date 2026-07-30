'use client';

import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function ProfileView({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'comments' | 'websites'>('comments');
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const isOwnProfile = user?.id === userId;
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleEditClick = () => {
    setEditName(profile.name || '');
    setEditBio(profile.bio || '');
    setIsEditing(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const formData = new FormData();
      if (editName !== profile.name) formData.append('name', editName);
      if (editBio !== profile.bio) formData.append('bio', editBio);
      if (editAvatar) formData.append('avatar', editAvatar);

      const updatedProfile = await api.updateProfile(formData);
      setProfile({ ...profile, ...updatedProfile });
      setIsEditing(false);
      setEditAvatar(null);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan profil');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const [profileData, activityData] = await Promise.all([
          api.getUserProfile(userId),
          api.getUserActivity(userId, activeTab),
        ]);
        setProfile(profileData);
        setActivity(activityData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, activeTab]);

  if (loading && !profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F9F9FD] pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="cursor-target inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-6 text-sm group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Kembali
        </button>

        {/* Profile Header */}
        <div className="glass-card p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          <div className="w-32 h-32 rounded-full border-4 border-[#8A2BE1]/20 overflow-hidden flex items-center justify-center bg-[#8A2BE1]/10 text-[#8A2BE1] text-4xl font-bold">
            {profile.avatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              profile.name.charAt(0).toUpperCase()
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left relative">
            {isOwnProfile && (
              <button
                onClick={handleEditClick}
                className="absolute top-0 right-0 cursor-target px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all"
              >
                Edit Profile
              </button>
            )}
            <h1 className="text-3xl font-bold mb-2 pr-24">{profile.name}</h1>
            <p className="text-text-secondary mb-4 max-w-lg">{profile.bio || "Desainer misterius yang belum menulis bio."}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold border border-[#8A2BE1]/50 text-[#8A2BE1] bg-[#8A2BE1]/10">
                Reputasi: {profile.reputationScore}
              </span>
              {profile.specializations?.map((spec: string, i: number) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white">
                  {spec}
                </span>
              ))}
            </div>
            
            <div className="flex gap-6 justify-center md:justify-start text-sm text-text-secondary">
              <div className="flex flex-col items-center md:items-start">
                <span className="font-bold text-white text-xl">{profile._count?.websites || 0}</span>
                <span>Website</span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="font-bold text-white text-xl">{profile._count?.comments || 0}</span>
                <span>Komentar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Tabs */}
        <div>
          <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-lg mb-6 w-fit">
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'comments' ? 'bg-[#8A2BE1] text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              Komentar Terbaru
            </button>
            <button
              onClick={() => setActiveTab('websites')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'websites' ? 'bg-[#8A2BE1] text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              Website Dibuat
            </button>
          </div>
          
          <div className="space-y-4">
            {activeTab === 'comments' ? (
              loading ? (
                <div className="text-center py-8 text-white/50">Memuat aktivitas...</div>
              ) : activity.length > 0 ? (
                activity.map((comment) => (
                  <div key={comment.id} className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-sm text-white/50 mb-2">
                      Mengomentari <Link href={`/community/${comment.post?.websiteId}`} className="text-[#8A2BE1] hover:underline">{comment.post?.website?.title}</Link>
                    </div>
                    <p className="text-white/80">{comment.content}</p>
                    <div className="text-xs text-white/40 mt-3">{new Date(comment.createdAt).toLocaleDateString()}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/50">Belum ada komentar.</div>
              )
            ) : (
              loading ? (
                <div className="text-center py-8 text-white/50">Memuat aktivitas...</div>
              ) : activity.length > 0 ? (
                activity.map((web) => (
                  <div key={web.id} className="p-5 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold mb-1">{web.title}</h3>
                      <p className="text-sm text-white/50">{web.description || 'Tidak ada deskripsi'}</p>
                    </div>
                    <Link href={`/dashboard/websites/${web.id}`} className="text-sm text-[#8A2BE1] border border-[#8A2BE1]/30 px-3 py-1.5 rounded-md hover:bg-[#8A2BE1]/10">
                      Detail
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/50">Belum ada website yang dibuat.</div>
              )
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 rounded-2xl border border-white/10 bg-[#0F0F0F]">
            <h2 className="text-xl font-bold mb-6 text-white">Edit Profile</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Avatar / Foto Profile</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
                    {editAvatar ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={URL.createObjectURL(editAvatar)} alt="Preview" className="w-full h-full object-cover" />
                    ) : profile.avatar ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={profile.avatar} alt="Current" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xl font-bold">{profile.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-target px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 text-white transition-colors"
                  >
                    Pilih Foto Baru
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setEditAvatar(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Nama</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#8A2BE1]/50 focus:ring-1 focus:ring-[#8A2BE1]/50 transition-all"
                  placeholder="Nama Anda"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#8A2BE1]/50 focus:ring-1 focus:ring-[#8A2BE1]/50 transition-all min-h-25 resize-y"
                  placeholder="Ceritakan sedikit tentang diri Anda..."
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditAvatar(null);
                    setEditName(profile.name || '');
                    setEditBio(profile.bio || '');
                  }}
                  className="cursor-target px-5 py-2.5 rounded-xl font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving || (!editName.trim())}
                  className="cursor-target px-5 py-2.5 cyber-cut bg-[#8A2BE1] text-[#F9F9FD] font-semibold hover:shadow-lg hover:shadow-[#8A2BE1]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
