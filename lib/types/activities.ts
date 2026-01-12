export enum ActivityType {
  BOUNTY_CREATED = 'BOUNTY_CREATED',
  BOUNTY_SUBMISSION = 'BOUNTY_SUBMISSION',
  BOUNTY_WON = 'BOUNTY_WON',
  BOUNTY_COMPLETED = 'BOUNTY_COMPLETED',
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  PROJECT_WON = 'PROJECT_WON',
  PROJECT_APPLICATION_SUBMITTED = 'PROJECT_APPLICATION_SUBMITTED',
  PROJECT_APPLICATION_ACCEPTED = 'PROJECT_APPLICATION_ACCEPTED',
  PROJECT_APPLICATION_REJECTED = 'PROJECT_APPLICATION_REJECTED',
  PROJECT_MILESTONE_SUBMITTED = 'PROJECT_MILESTONE_SUBMITTED',
  PROJECT_MILESTONE_APPROVED = 'PROJECT_MILESTONE_APPROVED',
  PROJECT_MILESTONE_PAID = 'PROJECT_MILESTONE_PAID',
  PROJECT_COMPLETED = 'PROJECT_COMPLETED',
  PROJECT_CANCELLED = 'PROJECT_CANCELLED',
  HACKATHON_CREATED = 'HACKATHON_CREATED',
  HACKATHON_SUBMISSION = 'HACKATHON_SUBMISSION',
  HACKATHON_WON = 'HACKATHON_WON',
  HACKATHON_COMPLETED = 'HACKATHON_COMPLETED',
  FORUM_THREAD_CREATED = 'FORUM_THREAD_CREATED',
  FORUM_POST_CREATED = 'FORUM_POST_CREATED',
  FORUM_COMMENT_CREATED = 'FORUM_COMMENT_CREATED',
  BADGE_EARNED = 'BADGE_EARNED',
  LEVEL_UP = 'LEVEL_UP',
}

export interface BountyCreatedMetadata {
  title: string
  reward: string
  currency: string
  [key: string]: any
}

export interface BountySubmissionMetadata {
  bountyTitle: string
  [key: string]: any
}

export interface BountyWonMetadata {
  bountyTitle: string
  position: number
  reward: string
  currency: string
  [key: string]: any
}

export interface BountyCompletedMetadata {
  bountyTitle: string
  [key: string]: any
}

export interface ProjectCreatedMetadata {
  title: string
  reward: string
  currency: string
  [key: string]: any
}

export interface ProjectUpdatedMetadata {
  title: string
  [key: string]: any
}

export interface ProjectWonMetadata {
  projectTitle: string
  reward: string
  currency: string
  [key: string]: any
}

export interface ProjectApplicationMetadata {
  projectTitle: string
  [key: string]: any
}

export interface ProjectMilestoneMetadata {
  projectTitle: string
  milestoneTitle: string
  [key: string]: any
}

export interface ProjectMilestonePaidMetadata {
  projectTitle: string
  milestoneTitle: string
  amount: string
  currency: string
  [key: string]: any
}

export interface ProjectCompletedMetadata {
  projectTitle: string
  [key: string]: any
}

export interface ProjectCancelledMetadata {
  projectTitle: string
  [key: string]: any
}

export interface HackathonCreatedMetadata {
  title: string
  totalReward: string
  currency: string
  [key: string]: any
}

export interface HackathonSubmissionMetadata {
  hackathonTitle: string
  trackName?: string
  [key: string]: any
}

export interface HackathonWonMetadata {
  hackathonTitle: string
  position: number
  reward: string
  currency: string
  trackName?: string
  [key: string]: any
}

export interface HackathonCompletedMetadata {
  hackathonTitle: string
  [key: string]: any
}

export interface ForumThreadCreatedMetadata {
  threadTitle: string
  categoryName: string
  [key: string]: any
}

export interface ForumPostCreatedMetadata {
  threadTitle: string
  [key: string]: any
}

export interface ForumCommentCreatedMetadata {
  postAuthor: string
  [key: string]: any
}

export interface BadgeEarnedMetadata {
  badgeName: string
  badgeIcon: string
  [key: string]: any
}

export interface LevelUpMetadata {
  newLevel: string
  [key: string]: any
}

export type ActivityMetadata<T extends ActivityType> =
  T extends ActivityType.BOUNTY_CREATED
    ? BountyCreatedMetadata
    : T extends ActivityType.BOUNTY_SUBMISSION
    ? BountySubmissionMetadata
    : T extends ActivityType.BOUNTY_WON
    ? BountyWonMetadata
    : T extends ActivityType.BOUNTY_COMPLETED
    ? BountyCompletedMetadata
    : T extends ActivityType.PROJECT_CREATED
    ? ProjectCreatedMetadata
    : T extends ActivityType.PROJECT_UPDATED
    ? ProjectUpdatedMetadata
    : T extends ActivityType.PROJECT_WON
    ? ProjectWonMetadata
    : T extends ActivityType.PROJECT_APPLICATION_SUBMITTED
    ? ProjectApplicationMetadata
    : T extends ActivityType.PROJECT_APPLICATION_ACCEPTED
    ? ProjectApplicationMetadata
    : T extends ActivityType.PROJECT_APPLICATION_REJECTED
    ? ProjectApplicationMetadata
    : T extends ActivityType.PROJECT_MILESTONE_SUBMITTED
    ? ProjectMilestoneMetadata
    : T extends ActivityType.PROJECT_MILESTONE_APPROVED
    ? ProjectMilestoneMetadata
    : T extends ActivityType.PROJECT_MILESTONE_PAID
    ? ProjectMilestonePaidMetadata
    : T extends ActivityType.PROJECT_COMPLETED
    ? ProjectCompletedMetadata
    : T extends ActivityType.PROJECT_CANCELLED
    ? ProjectCancelledMetadata
    : T extends ActivityType.HACKATHON_CREATED
    ? HackathonCreatedMetadata
    : T extends ActivityType.HACKATHON_SUBMISSION
    ? HackathonSubmissionMetadata
    : T extends ActivityType.HACKATHON_WON
    ? HackathonWonMetadata
    : T extends ActivityType.HACKATHON_COMPLETED
    ? HackathonCompletedMetadata
    : T extends ActivityType.FORUM_THREAD_CREATED
    ? ForumThreadCreatedMetadata
    : T extends ActivityType.FORUM_POST_CREATED
    ? ForumPostCreatedMetadata
    : T extends ActivityType.FORUM_COMMENT_CREATED
    ? ForumCommentCreatedMetadata
    : T extends ActivityType.BADGE_EARNED
    ? BadgeEarnedMetadata
    : T extends ActivityType.LEVEL_UP
    ? LevelUpMetadata
    : Record<string, any>

export interface BaseActivityPayload {
  id: string // Typically present in response
  userId: string
  type: ActivityType
  message: string
  bountyId?: string
  projectId?: string
  hackathonId?: string
  createdAt: string // Formatted date string or ISO
  user?: {
    id: string
    firstName: string
    lastName: string
    username: string
    profilePicture: string
  }
}

export type ActivityPayload<T extends ActivityType = ActivityType> =
  BaseActivityPayload & {
    type: T
    metadata?: ActivityMetadata<T>
  }

export interface PaginatedActivityResponse {
  data: ActivityPayload[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export enum ActivityCategory {
  BOUNTY = 'bounty',
  PROJECT = 'project',
  HACKATHON = 'hackathon',
  FORUM = 'forum',
  REPUTATION = 'reputation',
}

export const ActivityTypeToCategory: Record<ActivityType, ActivityCategory> = {
  [ActivityType.BOUNTY_CREATED]: ActivityCategory.BOUNTY,
  [ActivityType.BOUNTY_SUBMISSION]: ActivityCategory.BOUNTY,
  [ActivityType.BOUNTY_WON]: ActivityCategory.BOUNTY,
  [ActivityType.BOUNTY_COMPLETED]: ActivityCategory.BOUNTY,
  [ActivityType.PROJECT_CREATED]: ActivityCategory.PROJECT,
  [ActivityType.PROJECT_UPDATED]: ActivityCategory.PROJECT,
  [ActivityType.PROJECT_WON]: ActivityCategory.PROJECT,
  [ActivityType.PROJECT_APPLICATION_SUBMITTED]: ActivityCategory.PROJECT,
  [ActivityType.PROJECT_APPLICATION_ACCEPTED]: ActivityCategory.PROJECT,
  [ActivityType.PROJECT_APPLICATION_REJECTED]: ActivityCategory.PROJECT,
  [ActivityType.PROJECT_MILESTONE_SUBMITTED]: ActivityCategory.PROJECT,
  [ActivityType.PROJECT_MILESTONE_APPROVED]: ActivityCategory.PROJECT,
  [ActivityType.PROJECT_MILESTONE_PAID]: ActivityCategory.PROJECT,
  [ActivityType.PROJECT_COMPLETED]: ActivityCategory.PROJECT,
  [ActivityType.PROJECT_CANCELLED]: ActivityCategory.PROJECT,
  [ActivityType.HACKATHON_CREATED]: ActivityCategory.HACKATHON,
  [ActivityType.HACKATHON_SUBMISSION]: ActivityCategory.HACKATHON,
  [ActivityType.HACKATHON_WON]: ActivityCategory.HACKATHON,
  [ActivityType.HACKATHON_COMPLETED]: ActivityCategory.HACKATHON,
  [ActivityType.FORUM_THREAD_CREATED]: ActivityCategory.FORUM,
  [ActivityType.FORUM_POST_CREATED]: ActivityCategory.FORUM,
  [ActivityType.FORUM_COMMENT_CREATED]: ActivityCategory.FORUM,
  [ActivityType.BADGE_EARNED]: ActivityCategory.REPUTATION,
  [ActivityType.LEVEL_UP]: ActivityCategory.REPUTATION,
}
