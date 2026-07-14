-- ============================================================================
-- builders.review — REFERENCE MySQL 8 schema (utf8mb4). For reading only.
-- The CANONICAL schema is produced by `npx prisma migrate dev`
-- (prisma/migrations/*/migration.sql). This file mirrors prisma/schema.prisma.
-- ============================================================================
SET NAMES utf8mb4;

-- ---- Auth.js -----------------------------------------------------------------
CREATE TABLE users (
  id            VARCHAR(191) NOT NULL PRIMARY KEY,
  name          VARCHAR(191) NULL,
  email         VARCHAR(191) NULL,
  emailVerified DATETIME(3)  NULL,
  image         TEXT         NULL,
  createdAt     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE accounts (
  id                VARCHAR(191) NOT NULL PRIMARY KEY,
  userId            VARCHAR(191) NOT NULL,
  type              VARCHAR(191) NOT NULL,
  provider          VARCHAR(191) NOT NULL,
  providerAccountId VARCHAR(191) NOT NULL,
  refresh_token     TEXT NULL, access_token TEXT NULL, expires_at INT NULL,
  token_type        VARCHAR(191) NULL, scope VARCHAR(191) NULL,
  id_token          TEXT NULL, session_state VARCHAR(191) NULL,
  UNIQUE KEY uq_accounts_provider (provider, providerAccountId),
  KEY idx_accounts_user (userId),
  CONSTRAINT fk_accounts_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sessions (
  id           VARCHAR(191) NOT NULL PRIMARY KEY,
  sessionToken VARCHAR(191) NOT NULL,
  userId       VARCHAR(191) NOT NULL,
  expires      DATETIME(3)  NOT NULL,
  UNIQUE KEY uq_sessions_token (sessionToken),
  KEY idx_sessions_user (userId),
  CONSTRAINT fk_sessions_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE verification_tokens (
  identifier VARCHAR(191) NOT NULL,
  token      VARCHAR(191) NOT NULL,
  expires    DATETIME(3)  NOT NULL,
  UNIQUE KEY uq_vt_token (token),
  UNIQUE KEY uq_vt_identifier_token (identifier, token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- Review platform ---------------------------------------------------------
CREATE TABLE programs (
  slug        VARCHAR(191) NOT NULL PRIMARY KEY,
  title       VARCHAR(191) NOT NULL,
  type        ENUM('course','internship','program','mentorship','portfolio_service','career_support','community','website','other') NOT NULL,
  officialUrl TEXT NULL,
  summary     TEXT NOT NULL,
  seoIntro    TEXT NOT NULL,
  sortOrder   INT NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE review_categories (
  `key`       VARCHAR(191) NOT NULL PRIMARY KEY,
  label       VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  sortOrder   INT NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reviewer_profiles (
  id          CHAR(36) NOT NULL PRIMARY KEY,
  userId      VARCHAR(191) NULL,
  displayName VARCHAR(191) NOT NULL,
  emailHash   VARCHAR(191) NOT NULL,
  createdAt   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_rp_user (userId),
  UNIQUE KEY uq_rp_emailhash (emailHash),
  CONSTRAINT fk_rp_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reviews (
  id                  CHAR(36) NOT NULL PRIMARY KEY,
  slug                VARCHAR(191) NOT NULL,
  experienceType      ENUM('course','internship','program','mentorship','portfolio_service','career_support','community','website','other') NOT NULL,
  programSlug         VARCHAR(191) NULL,
  programScope        VARCHAR(191) NOT NULL DEFAULT '',
  title               VARCHAR(191) NOT NULL,
  body                TEXT NOT NULL,
  overallRating       INT NOT NULL,
  categoryRatings     JSON NOT NULL,
  pros                JSON NOT NULL,
  improvements        JSON NOT NULL,
  outcome             TEXT NULL,
  wouldRecommend      BOOLEAN NULL,
  reviewerDisplayName VARCHAR(191) NOT NULL,
  reviewerEmailHash   VARCHAR(191) NOT NULL,
  reviewerId          CHAR(36) NULL,
  relationship        VARCHAR(191) NOT NULL DEFAULT 'student',
  batch               VARCHAR(191) NULL,
  experienceDate      DATE NOT NULL,
  verified            BOOLEAN NOT NULL DEFAULT FALSE,
  status              ENUM('draft','pending_verification','pending_moderation','approved','rejected','flagged','removed') NOT NULL DEFAULT 'pending_verification',
  helpfulCount        INT NOT NULL DEFAULT 0,
  reportCount         INT NOT NULL DEFAULT 0,
  spamFlags           JSON NOT NULL,
  isSample            BOOLEAN NOT NULL DEFAULT FALSE,
  submittedAt         DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  verifiedAt          DATETIME(3) NULL, publishedAt DATETIME(3) NULL,
  lastEditedAt        DATETIME(3) NULL, moderatedAt DATETIME(3) NULL, removedAt DATETIME(3) NULL,
  UNIQUE KEY uq_reviews_slug (slug),
  UNIQUE KEY uniq_review_dedupe (reviewerEmailHash, experienceType, programScope),
  KEY idx_reviews_status_pub (status, publishedAt),
  KEY idx_reviews_program (programSlug, status),
  KEY idx_reviews_exptype (experienceType, status),
  CONSTRAINT fk_reviews_program FOREIGN KEY (programSlug) REFERENCES programs(slug) ON DELETE SET NULL,
  CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewerId) REFERENCES reviewer_profiles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE category_ratings (
  id          CHAR(36) NOT NULL PRIMARY KEY,
  reviewId    CHAR(36) NOT NULL,
  categoryKey VARCHAR(191) NOT NULL,
  value       INT NOT NULL,
  UNIQUE KEY uq_cr (reviewId, categoryKey),
  KEY idx_cr_cat (categoryKey),
  CONSTRAINT fk_cr_review FOREIGN KEY (reviewId) REFERENCES reviews(id) ON DELETE CASCADE,
  CONSTRAINT fk_cr_cat FOREIGN KEY (categoryKey) REFERENCES review_categories(`key`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE verification_records (
  id CHAR(36) NOT NULL PRIMARY KEY, reviewId CHAR(36) NOT NULL,
  method VARCHAR(191) NOT NULL DEFAULT 'email', tokenHash VARCHAR(191) NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), verifiedAt DATETIME(3) NULL,
  KEY idx_vr_review (reviewId),
  CONSTRAINT fk_vr_review FOREIGN KEY (reviewId) REFERENCES reviews(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE company_responses (
  id CHAR(36) NOT NULL PRIMARY KEY, reviewId CHAR(36) NOT NULL,
  authorName VARCHAR(191) NOT NULL DEFAULT 'Portfolio Builders', body TEXT NOT NULL,
  respondedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_resp_review (reviewId),
  CONSTRAINT fk_resp_review FOREIGN KEY (reviewId) REFERENCES reviews(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE helpful_votes (
  id CHAR(36) NOT NULL PRIMARY KEY, reviewId CHAR(36) NOT NULL, voterHash VARCHAR(191) NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_hv (reviewId, voterHash),
  CONSTRAINT fk_hv_review FOREIGN KEY (reviewId) REFERENCES reviews(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE review_reports (
  id CHAR(36) NOT NULL PRIMARY KEY, reviewId CHAR(36) NOT NULL,
  reporterHash VARCHAR(191) NOT NULL DEFAULT '', reason VARCHAR(191) NOT NULL,
  details TEXT NOT NULL, status VARCHAR(191) NOT NULL DEFAULT 'open',
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_rr (reviewId, reporterHash), KEY idx_rr_status (status),
  CONSTRAINT fk_rr_review FOREIGN KEY (reviewId) REFERENCES reviews(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE moderation_actions (
  id CHAR(36) NOT NULL PRIMARY KEY, reviewId CHAR(36) NOT NULL, actorId VARCHAR(191) NULL,
  action VARCHAR(191) NOT NULL, reason TEXT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_ma_review (reviewId),
  CONSTRAINT fk_ma_review FOREIGN KEY (reviewId) REFERENCES reviews(id) ON DELETE CASCADE,
  CONSTRAINT fk_ma_actor FOREIGN KEY (actorId) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE review_attachments (
  id CHAR(36) NOT NULL PRIMARY KEY, reviewId CHAR(36) NOT NULL,
  storagePath TEXT NOT NULL, mimeType VARCHAR(191) NOT NULL, sizeBytes INT NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_att_review (reviewId),
  CONSTRAINT fk_att_review FOREIGN KEY (reviewId) REFERENCES reviews(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- External sources --------------------------------------------------------
CREATE TABLE review_sources (
  slug VARCHAR(191) NOT NULL PRIMARY KEY, name VARCHAR(191) NOT NULL,
  sourceGroup ENUM('first_party','learner','employer') NOT NULL,
  ratingType ENUM('five_star','recommendation_pct','letter_grade') NOT NULL DEFAULT 'five_star',
  officialUrl TEXT NULL, defaultMin DECIMAL(6,2) NOT NULL DEFAULT 1, defaultMax DECIMAL(6,2) NOT NULL DEFAULT 5,
  integrationMode ENUM('official_api','official_widget','partner_api','authorized_import','manual_summary','external_link_only','disabled') NOT NULL DEFAULT 'disabled',
  countsTowardLearnerScore BOOLEAN NOT NULL DEFAULT FALSE,
  attributionRequirements TEXT NULL, complianceNotes TEXT NULL,
  syncEnabled BOOLEAN NOT NULL DEFAULT FALSE, active BOOLEAN NOT NULL DEFAULT TRUE,
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE external_profiles (
  id CHAR(36) NOT NULL PRIMARY KEY, sourceSlug VARCHAR(191) NOT NULL,
  externalProfileId VARCHAR(191) NULL, externalProfileUrl TEXT NOT NULL,
  externalBusinessName VARCHAR(191) NOT NULL DEFAULT 'Portfolio Builders',
  integrationMode ENUM('official_api','official_widget','partner_api','authorized_import','manual_summary','external_link_only','disabled') NOT NULL DEFAULT 'external_link_only',
  verificationStatus VARCHAR(191) NOT NULL DEFAULT 'unverified', verifiedById VARCHAR(191) NULL,
  verifiedAt DATETIME(3) NULL, apiConnectionStatus VARCHAR(191) NOT NULL DEFAULT 'n/a',
  lastSyncAt DATETIME(3) NULL, lastVerifiedAt DATETIME(3) NULL, nextSyncAllowedAt DATETIME(3) NULL,
  externalOverallRating DECIMAL(4,2) NULL, externalReviewCount INT NULL,
  recommendationPct DECIMAL(5,2) NULL, letterGrade VARCHAR(191) NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE, isSample BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_ep (sourceSlug, externalProfileId), KEY idx_ep_active (active, verificationStatus),
  CONSTRAINT fk_ep_source FOREIGN KEY (sourceSlug) REFERENCES review_sources(slug) ON DELETE CASCADE,
  CONSTRAINT fk_ep_verifier FOREIGN KEY (verifiedById) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE external_reviews (
  id CHAR(36) NOT NULL PRIMARY KEY, sourceSlug VARCHAR(191) NOT NULL, externalProfileId CHAR(36) NOT NULL,
  externalReviewId VARCHAR(191) NULL, originalReviewUrl TEXT NULL,
  authorDisplayName VARCHAR(191) NOT NULL, authorPhotoUrl TEXT NULL, title VARCHAR(191) NULL, body TEXT NOT NULL,
  isExcerpt BOOLEAN NOT NULL DEFAULT FALSE, originalRating DECIMAL(6,2) NOT NULL,
  originalScaleMin DECIMAL(6,2) NOT NULL, originalScaleMax DECIMAL(6,2) NOT NULL, originalRatingLabel VARCHAR(191) NOT NULL,
  normalizedRating DECIMAL(4,2) NULL, sourceGroup ENUM('first_party','learner','employer') NOT NULL,
  publishedDate DATETIME(3) NULL, importedDate DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), lastSyncedDate DATETIME(3) NULL,
  verification VARCHAR(191) NOT NULL DEFAULT 'unverified', attribution TEXT NOT NULL, language VARCHAR(191) NULL,
  companyResponse TEXT NULL,
  importMethod ENUM('official_api','official_widget','partner_api','authorized_import','manual_summary','external_link_only','disabled') NOT NULL DEFAULT 'manual_summary',
  contentHash VARCHAR(191) NOT NULL, visibility VARCHAR(191) NOT NULL DEFAULT 'visible',
  removed BOOLEAN NOT NULL DEFAULT FALSE, isSample BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE KEY uq_exr_extid (sourceSlug, externalProfileId, externalReviewId),
  UNIQUE KEY uq_exr_hash (sourceSlug, externalProfileId, contentHash),
  KEY idx_exr_source (sourceSlug, visibility, removed), KEY idx_exr_profile (externalProfileId),
  CONSTRAINT fk_exr_source FOREIGN KEY (sourceSlug) REFERENCES review_sources(slug) ON DELETE CASCADE,
  CONSTRAINT fk_exr_profile FOREIGN KEY (externalProfileId) REFERENCES external_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sync_jobs (
  id CHAR(36) NOT NULL PRIMARY KEY, sourceSlug VARCHAR(191) NOT NULL, externalProfileId CHAR(36) NULL,
  jobType VARCHAR(191) NOT NULL DEFAULT 'scheduled', startedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  endedAt DATETIME(3) NULL, status VARCHAR(191) NOT NULL DEFAULT 'queued',
  fetched INT NOT NULL DEFAULT 0, created INT NOT NULL DEFAULT 0, updated INT NOT NULL DEFAULT 0, skipped INT NOT NULL DEFAULT 0,
  errorSummary TEXT NULL, retryCount INT NOT NULL DEFAULT 0,
  KEY idx_sj (sourceSlug, startedAt),
  CONSTRAINT fk_sj_source FOREIGN KEY (sourceSlug) REFERENCES review_sources(slug) ON DELETE CASCADE,
  CONSTRAINT fk_sj_profile FOREIGN KEY (externalProfileId) REFERENCES external_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE import_batches (
  id CHAR(36) NOT NULL PRIMARY KEY, sourceSlug VARCHAR(191) NOT NULL, format VARCHAR(191) NOT NULL DEFAULT 'csv',
  adminId VARCHAR(191) NULL, status VARCHAR(191) NOT NULL DEFAULT 'preview', totals JSON NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_ib (sourceSlug),
  CONSTRAINT fk_ib_source FOREIGN KEY (sourceSlug) REFERENCES review_sources(slug) ON DELETE CASCADE,
  CONSTRAINT fk_ib_admin FOREIGN KEY (adminId) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE source_credentials (
  sourceSlug VARCHAR(191) NOT NULL PRIMARY KEY, credentialRef VARCHAR(191) NULL,
  encryptedSecret LONGBLOB NULL, updatedById VARCHAR(191) NULL,
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_sc_source FOREIGN KEY (sourceSlug) REFERENCES review_sources(slug) ON DELETE CASCADE,
  CONSTRAINT fk_sc_user FOREIGN KEY (updatedById) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- Administration & website ------------------------------------------------
CREATE TABLE admin_users (
  userId VARCHAR(191) NOT NULL PRIMARY KEY,
  role ENUM('moderator','admin') NOT NULL DEFAULT 'moderator',
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_au_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE audit_logs (
  id CHAR(36) NOT NULL PRIMARY KEY, actorId VARCHAR(191) NULL, action VARCHAR(191) NOT NULL,
  targetId VARCHAR(191) NULL, detail TEXT NULL, createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_al_created (createdAt),
  CONSTRAINT fk_al_actor FOREIGN KEY (actorId) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contact_messages (
  id CHAR(36) NOT NULL PRIMARY KEY, name VARCHAR(191) NOT NULL, email VARCHAR(191) NOT NULL,
  topic VARCHAR(191) NOT NULL, message TEXT NOT NULL, createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_cm_created (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE site_settings (
  `key` VARCHAR(191) NOT NULL PRIMARY KEY, value JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE seo_settings (
  path VARCHAR(191) NOT NULL PRIMARY KEY, title VARCHAR(191) NULL, description TEXT NULL,
  ogImage TEXT NULL, noindex BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE aeo_questions (
  id CHAR(36) NOT NULL PRIMARY KEY, question TEXT NOT NULL, answer TEXT NOT NULL,
  pagePath VARCHAR(191) NOT NULL DEFAULT '/', sortOrder INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE, updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_aeo (pagePath, active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
