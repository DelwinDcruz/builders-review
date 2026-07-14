import { HubPage } from "@/components/content/HubPage";
import { pageMetadata } from "@/lib/seo/metadata";
export const revalidate = 300;
export const metadata = pageMetadata({
  title: "Portfolio Builders internship reviews — FYUGP, AICTE, KTU, CUSAT & MBA",
  description: "Read intern reviews of Portfolio Builders internships: FYUGP credit internships, AICTE internships (CS, Mechanical, Civil, EC & EEE), KTU, CUSAT and MBA internships. Ratings for documentation support, mentorship and real project work.",
  path: "/internships"
});
export default function Page() {
  return <HubPage type="internship" path="/internships" crumb="Internship reviews"
    title="Portfolio Builders internship reviews"
    question="What do FYUGP and AICTE interns say about Portfolio Builders?"
    intro="Reviews from interns on every Portfolio Builders internship track listed on the official website — FYUGP credit internships, AICTE internships across engineering branches, KTU, CUSAT and MBA internships. Rated on documentation support, mentor guidance, project work and communication." />;
}
