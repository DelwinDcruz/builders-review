import { HubPage } from "@/components/content/HubPage";
import { pageMetadata } from "@/lib/seo/metadata";
export const revalidate = 300;
export const metadata = pageMetadata({
  title: "Portfolio Builders mentor reviews — how is the mentor support?",
  description: "What students and interns say about Portfolio Builders mentor support: availability, expertise, responsiveness and the quality of feedback on real project work.",
  path: "/mentors"
});
export default function Page() {
  return <HubPage type="mentorship" path="/mentors" crumb="Mentor reviews" showPrograms={false}
    title="Portfolio Builders mentor reviews"
    question="How is the mentor support at Portfolio Builders?"
    intro="Mentorship is rated separately from the courses themselves, because a strong curriculum and weak feedback are not the same thing. These reviews cover mentor availability, expertise, responsiveness and how specific the feedback is." />;
}
