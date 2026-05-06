import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kegiatan | SKRT MEDIA",
  description: "Kegiatan dan acara SKRT MEDIA",
};

export default function KegiatanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
