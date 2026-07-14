export interface ReviewCategory { key: string; label: string; description: string; order: number; active: boolean; }

/** Admin-managed in production (`review_categories` table). This is the seed. */
export const DEFAULT_CATEGORIES: ReviewCategory[] = [
  { key: "overall_experience", label: "Overall experience", description: "The experience as a whole.", order: 1, active: true },
  { key: "course_quality", label: "Course quality", description: "Depth, structure and usefulness of the teaching.", order: 2, active: true },
  { key: "internship_experience", label: "Internship experience", description: "The internship itself: work, guidance, documentation.", order: 3, active: true },
  { key: "mentor_support", label: "Mentor support", description: "Availability, expertise and quality of mentor feedback.", order: 4, active: true },
  { key: "practical_projects", label: "Practical projects", description: "How real and useful the project work is.", order: 5, active: true },
  { key: "portfolio_support", label: "Portfolio-building support", description: "Help producing a job-ready portfolio.", order: 6, active: true },
  { key: "career_guidance", label: "Career guidance", description: "Advice on direction, roles and preparation.", order: 7, active: true },
  { key: "placement_assistance", label: "Placement assistance", description: "Support in finding and securing roles.", order: 8, active: true },
  { key: "communication", label: "Communication", description: "Clarity and frequency of communication.", order: 9, active: true },
  { key: "support_responsiveness", label: "Support responsiveness", description: "How quickly questions and issues are handled.", order: 10, active: true },
  { key: "learning_materials", label: "Learning materials", description: "Quality of notes, recordings and resources.", order: 11, active: true },
  { key: "value_for_money", label: "Value for money", description: "Worth relative to the price paid.", order: 12, active: true },
  { key: "online_experience", label: "Online learning experience", description: "Live/online sessions and platform.", order: 13, active: true },
  { key: "offline_experience", label: "Offline learning experience", description: "In-person sessions at the centre.", order: 14, active: true },
  { key: "community_experience", label: "Community experience", description: "The WhatsApp/Discord community and events.", order: 15, active: true },
  { key: "transparency", label: "Transparency", description: "Honesty about fees, outcomes and expectations.", order: 16, active: true },
  { key: "website_experience", label: "Website experience", description: "Using portfoliobuilders.in itself.", order: 17, active: true }
];

export const CATEGORY_MAP: Record<string, ReviewCategory> = Object.fromEntries(DEFAULT_CATEGORIES.map((c) => [c.key, c]));
