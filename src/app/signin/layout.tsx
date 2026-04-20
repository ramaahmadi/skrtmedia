import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Panitia | SKRT MEDIA",
  description: "Login khusus untuk panitia SKRT MEDIA",
};

export default function SigninLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
