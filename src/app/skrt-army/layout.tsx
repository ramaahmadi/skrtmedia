import { redirect } from 'next/navigation';
import ArmyHeader from '@/components/ArmyHeader';
import { getServerSession } from '@/lib/auth';

export default async function SKRTArmyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) {
    redirect('/signin');
  }

  return (
    <div>
      <ArmyHeader />
      {children}
    </div>
  );
}
