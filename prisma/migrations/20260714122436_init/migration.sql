-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `accounts_userId_idx`(`userId`),
    UNIQUE INDEX `accounts_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sessions_sessionToken_key`(`sessionToken`),
    INDEX `sessions_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification_tokens` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `verification_tokens_token_key`(`token`),
    UNIQUE INDEX `verification_tokens_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `programs` (
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` ENUM('course', 'internship', 'program', 'mentorship', 'portfolio_service', 'career_support', 'community', 'website', 'other') NOT NULL,
    `officialUrl` TEXT NULL,
    `summary` TEXT NOT NULL,
    `seoIntro` TEXT NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`slug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_categories` (
    `key` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviewer_profiles` (
    `id` CHAR(36) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `emailHash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `reviewer_profiles_userId_key`(`userId`),
    UNIQUE INDEX `reviewer_profiles_emailHash_key`(`emailHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` CHAR(36) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `experienceType` ENUM('course', 'internship', 'program', 'mentorship', 'portfolio_service', 'career_support', 'community', 'website', 'other') NOT NULL,
    `programSlug` VARCHAR(191) NULL,
    `programScope` VARCHAR(191) NOT NULL DEFAULT '',
    `title` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `overallRating` INTEGER NOT NULL,
    `categoryRatings` JSON NOT NULL,
    `pros` JSON NOT NULL,
    `improvements` JSON NOT NULL,
    `outcome` TEXT NULL,
    `wouldRecommend` BOOLEAN NULL,
    `reviewerDisplayName` VARCHAR(191) NOT NULL,
    `reviewerEmailHash` VARCHAR(191) NOT NULL,
    `reviewerId` VARCHAR(191) NULL,
    `relationship` VARCHAR(191) NOT NULL DEFAULT 'student',
    `batch` VARCHAR(191) NULL,
    `experienceDate` DATE NOT NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('draft', 'pending_verification', 'pending_moderation', 'approved', 'rejected', 'flagged', 'removed') NOT NULL DEFAULT 'pending_verification',
    `helpfulCount` INTEGER NOT NULL DEFAULT 0,
    `reportCount` INTEGER NOT NULL DEFAULT 0,
    `spamFlags` JSON NOT NULL,
    `isSample` BOOLEAN NOT NULL DEFAULT false,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `verifiedAt` DATETIME(3) NULL,
    `publishedAt` DATETIME(3) NULL,
    `lastEditedAt` DATETIME(3) NULL,
    `moderatedAt` DATETIME(3) NULL,
    `removedAt` DATETIME(3) NULL,

    UNIQUE INDEX `reviews_slug_key`(`slug`),
    INDEX `reviews_status_publishedAt_idx`(`status`, `publishedAt`),
    INDEX `reviews_programSlug_status_idx`(`programSlug`, `status`),
    INDEX `reviews_experienceType_status_idx`(`experienceType`, `status`),
    UNIQUE INDEX `reviews_reviewerEmailHash_experienceType_programScope_key`(`reviewerEmailHash`, `experienceType`, `programScope`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category_ratings` (
    `id` CHAR(36) NOT NULL,
    `reviewId` VARCHAR(191) NOT NULL,
    `categoryKey` VARCHAR(191) NOT NULL,
    `value` INTEGER NOT NULL,

    INDEX `category_ratings_categoryKey_idx`(`categoryKey`),
    UNIQUE INDEX `category_ratings_reviewId_categoryKey_key`(`reviewId`, `categoryKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification_records` (
    `id` CHAR(36) NOT NULL,
    `reviewId` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL DEFAULT 'email',
    `tokenHash` VARCHAR(191) NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `verifiedAt` DATETIME(3) NULL,

    INDEX `verification_records_reviewId_idx`(`reviewId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_responses` (
    `id` CHAR(36) NOT NULL,
    `reviewId` VARCHAR(191) NOT NULL,
    `authorName` VARCHAR(191) NOT NULL DEFAULT 'Portfolio Builders',
    `body` TEXT NOT NULL,
    `respondedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `company_responses_reviewId_key`(`reviewId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `helpful_votes` (
    `id` CHAR(36) NOT NULL,
    `reviewId` VARCHAR(191) NOT NULL,
    `voterHash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `helpful_votes_reviewId_voterHash_key`(`reviewId`, `voterHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_reports` (
    `id` CHAR(36) NOT NULL,
    `reviewId` VARCHAR(191) NOT NULL,
    `reporterHash` VARCHAR(191) NOT NULL DEFAULT '',
    `reason` VARCHAR(191) NOT NULL,
    `details` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'open',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `review_reports_status_idx`(`status`),
    UNIQUE INDEX `review_reports_reviewId_reporterHash_key`(`reviewId`, `reporterHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `moderation_actions` (
    `id` CHAR(36) NOT NULL,
    `reviewId` VARCHAR(191) NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `reason` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `moderation_actions_reviewId_idx`(`reviewId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_attachments` (
    `id` CHAR(36) NOT NULL,
    `reviewId` VARCHAR(191) NOT NULL,
    `storagePath` TEXT NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `sizeBytes` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `review_attachments_reviewId_idx`(`reviewId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_sources` (
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `sourceGroup` ENUM('first_party', 'learner', 'employer') NOT NULL,
    `ratingType` ENUM('five_star', 'recommendation_pct', 'letter_grade') NOT NULL DEFAULT 'five_star',
    `officialUrl` TEXT NULL,
    `defaultMin` DECIMAL(6, 2) NOT NULL DEFAULT 1,
    `defaultMax` DECIMAL(6, 2) NOT NULL DEFAULT 5,
    `integrationMode` ENUM('official_api', 'official_widget', 'partner_api', 'authorized_import', 'manual_summary', 'external_link_only', 'disabled') NOT NULL DEFAULT 'disabled',
    `countsTowardLearnerScore` BOOLEAN NOT NULL DEFAULT false,
    `attributionRequirements` TEXT NULL,
    `complianceNotes` TEXT NULL,
    `syncEnabled` BOOLEAN NOT NULL DEFAULT false,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`slug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `external_profiles` (
    `id` CHAR(36) NOT NULL,
    `sourceSlug` VARCHAR(191) NOT NULL,
    `externalProfileId` VARCHAR(191) NULL,
    `externalProfileUrl` TEXT NOT NULL,
    `externalBusinessName` VARCHAR(191) NOT NULL DEFAULT 'Portfolio Builders',
    `integrationMode` ENUM('official_api', 'official_widget', 'partner_api', 'authorized_import', 'manual_summary', 'external_link_only', 'disabled') NOT NULL DEFAULT 'external_link_only',
    `verificationStatus` VARCHAR(191) NOT NULL DEFAULT 'unverified',
    `verifiedById` VARCHAR(191) NULL,
    `verifiedAt` DATETIME(3) NULL,
    `apiConnectionStatus` VARCHAR(191) NOT NULL DEFAULT 'n/a',
    `lastSyncAt` DATETIME(3) NULL,
    `lastVerifiedAt` DATETIME(3) NULL,
    `nextSyncAllowedAt` DATETIME(3) NULL,
    `externalOverallRating` DECIMAL(4, 2) NULL,
    `externalReviewCount` INTEGER NULL,
    `recommendationPct` DECIMAL(5, 2) NULL,
    `letterGrade` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `isSample` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `external_profiles_active_verificationStatus_idx`(`active`, `verificationStatus`),
    UNIQUE INDEX `external_profiles_sourceSlug_externalProfileId_key`(`sourceSlug`, `externalProfileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `external_reviews` (
    `id` CHAR(36) NOT NULL,
    `sourceSlug` VARCHAR(191) NOT NULL,
    `externalProfileId` VARCHAR(191) NOT NULL,
    `externalReviewId` VARCHAR(191) NULL,
    `originalReviewUrl` TEXT NULL,
    `authorDisplayName` VARCHAR(191) NOT NULL,
    `authorPhotoUrl` TEXT NULL,
    `title` VARCHAR(191) NULL,
    `body` TEXT NOT NULL,
    `isExcerpt` BOOLEAN NOT NULL DEFAULT false,
    `originalRating` DECIMAL(6, 2) NOT NULL,
    `originalScaleMin` DECIMAL(6, 2) NOT NULL,
    `originalScaleMax` DECIMAL(6, 2) NOT NULL,
    `originalRatingLabel` VARCHAR(191) NOT NULL,
    `normalizedRating` DECIMAL(4, 2) NULL,
    `sourceGroup` ENUM('first_party', 'learner', 'employer') NOT NULL,
    `publishedDate` DATETIME(3) NULL,
    `importedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastSyncedDate` DATETIME(3) NULL,
    `verification` VARCHAR(191) NOT NULL DEFAULT 'unverified',
    `attribution` TEXT NOT NULL,
    `language` VARCHAR(191) NULL,
    `companyResponse` TEXT NULL,
    `importMethod` ENUM('official_api', 'official_widget', 'partner_api', 'authorized_import', 'manual_summary', 'external_link_only', 'disabled') NOT NULL DEFAULT 'manual_summary',
    `contentHash` VARCHAR(191) NOT NULL,
    `visibility` VARCHAR(191) NOT NULL DEFAULT 'visible',
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `isSample` BOOLEAN NOT NULL DEFAULT false,

    INDEX `external_reviews_sourceSlug_visibility_removed_idx`(`sourceSlug`, `visibility`, `removed`),
    INDEX `external_reviews_externalProfileId_idx`(`externalProfileId`),
    UNIQUE INDEX `external_reviews_sourceSlug_externalProfileId_externalReview_key`(`sourceSlug`, `externalProfileId`, `externalReviewId`),
    UNIQUE INDEX `external_reviews_sourceSlug_externalProfileId_contentHash_key`(`sourceSlug`, `externalProfileId`, `contentHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sync_jobs` (
    `id` CHAR(36) NOT NULL,
    `sourceSlug` VARCHAR(191) NOT NULL,
    `externalProfileId` VARCHAR(191) NULL,
    `jobType` VARCHAR(191) NOT NULL DEFAULT 'scheduled',
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'queued',
    `fetched` INTEGER NOT NULL DEFAULT 0,
    `created` INTEGER NOT NULL DEFAULT 0,
    `updated` INTEGER NOT NULL DEFAULT 0,
    `skipped` INTEGER NOT NULL DEFAULT 0,
    `errorSummary` TEXT NULL,
    `retryCount` INTEGER NOT NULL DEFAULT 0,

    INDEX `sync_jobs_sourceSlug_startedAt_idx`(`sourceSlug`, `startedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `import_batches` (
    `id` CHAR(36) NOT NULL,
    `sourceSlug` VARCHAR(191) NOT NULL,
    `format` VARCHAR(191) NOT NULL DEFAULT 'csv',
    `adminId` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'preview',
    `totals` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `import_batches_sourceSlug_idx`(`sourceSlug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `source_credentials` (
    `sourceSlug` VARCHAR(191) NOT NULL,
    `credentialRef` VARCHAR(191) NULL,
    `encryptedSecret` LONGBLOB NULL,
    `updatedById` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`sourceSlug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_users` (
    `userId` VARCHAR(191) NOT NULL,
    `role` ENUM('moderator', 'admin') NOT NULL DEFAULT 'moderator',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` CHAR(36) NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `targetId` VARCHAR(191) NULL,
    `detail` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_messages` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `contact_messages_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `key` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seo_settings` (
    `path` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `ogImage` TEXT NULL,
    `noindex` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`path`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aeo_questions` (
    `id` CHAR(36) NOT NULL,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `pagePath` VARCHAR(191) NOT NULL DEFAULT '/',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `aeo_questions_pagePath_active_idx`(`pagePath`, `active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviewer_profiles` ADD CONSTRAINT `reviewer_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_programSlug_fkey` FOREIGN KEY (`programSlug`) REFERENCES `programs`(`slug`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `reviewer_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_ratings` ADD CONSTRAINT `category_ratings_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `reviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_ratings` ADD CONSTRAINT `category_ratings_categoryKey_fkey` FOREIGN KEY (`categoryKey`) REFERENCES `review_categories`(`key`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `verification_records` ADD CONSTRAINT `verification_records_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `reviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_responses` ADD CONSTRAINT `company_responses_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `reviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `helpful_votes` ADD CONSTRAINT `helpful_votes_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `reviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_reports` ADD CONSTRAINT `review_reports_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `reviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `moderation_actions` ADD CONSTRAINT `moderation_actions_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `reviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `moderation_actions` ADD CONSTRAINT `moderation_actions_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_attachments` ADD CONSTRAINT `review_attachments_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `reviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `external_profiles` ADD CONSTRAINT `external_profiles_sourceSlug_fkey` FOREIGN KEY (`sourceSlug`) REFERENCES `review_sources`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `external_profiles` ADD CONSTRAINT `external_profiles_verifiedById_fkey` FOREIGN KEY (`verifiedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `external_reviews` ADD CONSTRAINT `external_reviews_sourceSlug_fkey` FOREIGN KEY (`sourceSlug`) REFERENCES `review_sources`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `external_reviews` ADD CONSTRAINT `external_reviews_externalProfileId_fkey` FOREIGN KEY (`externalProfileId`) REFERENCES `external_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sync_jobs` ADD CONSTRAINT `sync_jobs_sourceSlug_fkey` FOREIGN KEY (`sourceSlug`) REFERENCES `review_sources`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sync_jobs` ADD CONSTRAINT `sync_jobs_externalProfileId_fkey` FOREIGN KEY (`externalProfileId`) REFERENCES `external_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `import_batches` ADD CONSTRAINT `import_batches_sourceSlug_fkey` FOREIGN KEY (`sourceSlug`) REFERENCES `review_sources`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `import_batches` ADD CONSTRAINT `import_batches_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `source_credentials` ADD CONSTRAINT `source_credentials_sourceSlug_fkey` FOREIGN KEY (`sourceSlug`) REFERENCES `review_sources`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `source_credentials` ADD CONSTRAINT `source_credentials_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_users` ADD CONSTRAINT `admin_users_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
