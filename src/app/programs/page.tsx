import { HubPage } from "@/components/content/HubPage";
import { pageMetadata } from "@/lib/seo/metadata";
export const revalidate = 300;
export const metadata = pageMetadata({
  title: "Portfolio Builders program reviews — portfolio building & career switching",
  description: "Reviews of the Portfolio Builders portfolio-building programs: the UI/UX Portfolio Building Program, Switch Careers to UI/UX, and the Senior UI/UX Portfolio Building Program.",
  path: "/programs"
});
export default function Page() {
  return <HubPage type="program" path="/programs" crumb="Program reviews"
    title="Portfolio Builders program reviews"
    question="Do the Portfolio Builders portfolio-building programs work?"
    intro="Reviews of the structured portfolio-building and career-switching programs — rated on structure, mentor feedback, live projects, portfolio outcomes and transparency about the time commitment." />;
}
