# Backend Data Requirements

This document tracks data fields that are currently used in the Create Stallion Frontend UI (or desired) but are missing from the current Backend API response types.

## Reputation / Leaderboard (`LeaderboardEntry`)

The following fields are used in the Leaderboard UI designs but are not present in the `LeaderboardEntry` type:

- **Rating**: (e.g. 4.98) - A calculated rating score for specific skills or overall performance.
- **Success Rate**: (e.g. 98%) - Percentage of tasks/bounties successfully completed.
- **Verified Status**: (`isVerified` boolean) - To display the "Verified Builder" badge.
- **Category / Primary Skill**: (e.g. "React", "Frontend") - To display the user's main expertise tag.
- **Completed Tasks Count**: Distinct from `bountyScore`. A raw count of completed items.

## Chat / Messages

- **Online Status**: Real-time boolean or status enum (`ONLINE`, `OFFLINE`, `AWAY`) to drive the green dot indicator.
- **Attachments**: Full implementation of file upload/storage returning `{ url: string, type: string, name: string }` in message payloads.
- **Typing Indicators**: Real-time event support (Socket.io) for "matches user is typing...".

## Forum

- **Thread List (`getThreads` / `searchThreads`)**:

  - **Missing Fields**: The API currently lacks `likeCount` and `replyCount` (or `postCount`) for each thread. These are essential for the dashboard list view.
  - **Content**: Ensure `content` or `description` is populated for the list view preview.

- **Thread Detail (`getThread`)**:

  - **Empty Content**: The `content` field is currently empty. The Original Post (OP) content should be in `thread.content`, not just in `posts[0]`.
  - **Missing Stats**: Needs `likeCount` and `viewCount` (if not incrementing correctly).

- **User Badges (Admin)**: Instead of a generic badges array, the `Thread`, `Post`, and `Comment` objects should include an `isAdmin` boolean field (or `author.isAdmin`) to indicate if the content creator is an administrator. This triggers the "Admin" badge display.

- **Forum Statistics**: Use endpoint `GET /forum/stats` to return global forum statistics.
  - `totalDiscussions`: Total number of threads.
  - `activeMembers`: Number of active users.
  - `postsToday`: Number of posts created in the last 24h.
  - `onlineUsers`: Number of users currently online.
