import FeedbackForm from "@/components/Trust-Islam/Feedback";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trust is Lam - Feedback",
  description: "Trust is Lam - Your Gateway to Islamic Knowledge",
  // other metadata
};

export default function Home() {
  return (
    <>
    <main>
      {/* <ScrollUp /> */}
      <FeedbackForm />
    </main>
    </>
  );
}
