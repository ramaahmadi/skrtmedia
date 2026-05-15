import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Page | skrtmedia.id",
  description: "Artikel dan Berita SKRT MEDIA",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
