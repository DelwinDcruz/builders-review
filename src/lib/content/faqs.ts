export interface FaqItem { q: string; a: string; }

export const PLATFORM_FAQS: FaqItem[] = [
  { q: "What is builders.review?",
    a: "builders.review is a dedicated review platform for Portfolio Builders. It brings together reviews written directly on this site by students, interns, alumni, parents and career switchers, plus ratings collected legally from third-party review platforms where Portfolio Builders has a genuine, verified profile." },
  { q: "Is builders.review independent of Portfolio Builders?",
    a: "No. builders.review is operated in connection with Portfolio Builders, the company being reviewed. We say so openly rather than posing as an independent third party. We publish our full methodology, never suppress genuine criticism, and never offer rewards in exchange for positive reviews." },
  { q: "Are reviews on builders.review verified?",
    a: "Every review submitted here requires email verification and passes human moderation before it is published. A review is labelled “Verified reviewer” only when that verification actually completed. Reviews from other platforms are labelled with their source and link back to the original." },
  { q: "How are ratings calculated?",
    a: "Only approved reviews count. When we combine our own reviews with an external platform's rating, we weight by the number of reviews behind each figure — never a plain average of platform averages. Learner, course, internship, mentor, career-support, website and employee scores are calculated separately." },
  { q: "Are employee reviews included in student ratings?",
    a: "No. Employee reviews from platforms such as Glassdoor, AmbitionBox and Indeed measure what it is like to work at Portfolio Builders, not what it is like to learn there. They are shown in a separate Employee experience section and never merged into learner scores." },
  { q: "Can Portfolio Builders reply to reviews?",
    a: "Yes. Portfolio Builders may post one public response per review. Responses are clearly labelled, are moderated to the same standards, and never change the review's rating." },
  { q: "Can I submit my own Portfolio Builders review?",
    a: "Yes. Anyone with a genuine, first-hand experience — a course, internship, program, mentorship, the community or the website — can write a review. It is verified by email and moderated before publication." }
];
