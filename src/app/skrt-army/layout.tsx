import ArmyHeader from '@/components/ArmyHeader';

export default function SKRTArmyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ArmyHeader />
      {children}
    </div>
  );
}
