import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artikel Detail | SKRT MEDIA",
  description: "Baca artikel lengkap dari SKRT MEDIA",
};

export default function ArticleDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
