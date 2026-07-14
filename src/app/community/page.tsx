import { HubPage } from "@/components/content/HubPage";
import { pageMetadata } from "@/lib/seo/metadata";
export const revalidate = 300;
export const metadata = pageMetadata({
  title: "Portfolio Builders community reviews — WhatsApp & Discord",
  description: "What members say about the free Portfolio Builders community: job and internship postings, networking, events and how active it really is.",
  path: "/community"
});
export default function Page() {
  return <HubPage type="community" path="/community" crumb="Community reviews" showPrograms={false}
    title="Portfolio Builders community reviews"
    question="Is the Portfolio Builders community worth joining?"
    intro="The free community runs on WhatsApp and Discord. These reviews cover how active it is, the quality of the job and internship postings, and whether questions actually get answered." />;
}
