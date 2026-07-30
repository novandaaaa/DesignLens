import ProfileView from '@/components/ProfileView';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProfileView userId={id} />;
}
