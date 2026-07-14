import { HubPage } from "@/components/content/HubPage";
import { pageMetadata } from "@/lib/seo/metadata";
export const revalidate = 300;
export const metadata = pageMetadata({
  title: "Portfolio Builders course reviews — UI/UX, Web Development & Flutter",
  description: "Read verified student reviews of Portfolio Builders courses: the UI/UX Design Course, Web Development, Flutter Development and the free courses. Ratings for teaching quality, projects, mentor support and value for money.",
  path: "/courses"
});
export default function Page() {
  return <HubPage type="course" path="/courses" crumb="Course reviews"
    title="Portfolio Builders course reviews"
    question="Are Portfolio Builders courses worth it?"
    intro="Student reviews of every Portfolio Builders course listed on the official website — UI/UX Design, Web Development, Flutter Development and the free learning paths. Each course is rated on teaching quality, practical projects, mentor support, learning materials and value for money." />;
}
