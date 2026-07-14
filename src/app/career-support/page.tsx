import { HubPage } from "@/components/content/HubPage";
import { pageMetadata } from "@/lib/seo/metadata";
export const revalidate = 300;
export const metadata = pageMetadata({
  title: "Portfolio Builders career support reviews — guidance & interview prep",
  description: "Reviews of Portfolio Builders career guidance: interview preparation, positioning, job postings and how much support students actually receive.",
  path: "/career-support"
});
export default function Page() {
  return <HubPage type="career_support" path="/career-support" crumb="Career support reviews" showPrograms={false}
    title="Portfolio Builders career support reviews"
    question="How useful is Portfolio Builders career guidance?"
    intro="Career guidance is rated separately from placement assistance. These reviews cover interview preparation, portfolio positioning, job postings and how proactive students needed to be." />;
}
