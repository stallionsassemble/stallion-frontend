# Backend Data Requirements

This document tracks data fields that are currently used in the Create Stallion Frontend UI (or desired) but are missing from the current Backend API response types.

## Reputation / Leaderboard (`LeaderboardEntry`)

The following fields are used in the Leaderboard UI designs but are not present in the `LeaderboardEntry` type:

- **Rating**: (e.g. 4.98) - A calculated rating score for specific skills or overall performance.
- **Success Rate**: (e.g. 98%) - Percentage of tasks/bounties successfully completed.
- **Verified Status**: (`isVerified` boolean) - To display the "Verified Builder" badge.
- **Category / Primary Skill**: (e.g. "React", "Frontend") - To display the user's main expertise tag. Currently defaults to "Developer".
- **Completed Tasks Count**: Distinct from `bountyScore`. A raw count of completed items.
- **Earned Amount**: Total earnings displayed on the Podium and Leaderboard rows.
- **Level**: (e.g. 1) - Often missing or defaulting to 1.
- **Badges**: Array of badge icons/ids for the user row.

### Fields needed in `LeaderboardEntry`

- category: string
- isVerified: boolean
- earnedAmount: number
- completedTask: number
- successRate: number
- level: number (or string, strictly defined)
- badges: Badge[]

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

- **Forum Statistics (`GET /forum/stats`)**:

  - **Purpose**: Provides real-time metrics for the Community Dashboard widgets.
  - **Response Structure**:
    ```json
    {
      "totalDiscussions": 1250, // Total count of threads/topics ever created
      "activeMembers": 340, // Unique users who have posted/replied/liked in the last 30 days
      "postsToday": 45, // Count of new threads + replies created since 00:00 UTC
      "onlineUsers": 82 // Number of authenticated users with an active WebSocket/session
    }
    ```

- \*\*GetThread
  Currenlt the get threads endpoint does not return data required on the UI for the forum sidebar. on the author object it is missing the posts, likes and replies fields.
  current defining in the types/forum.ts file
  author: {
  username: string
  firstName: string
  lastName: string
  profilePicture?: string
  posts: number - add
  likes: number - add
  replies: number - add
  }

- **Thread Reactions (`PATCH /forum/threads/:id/reactions`)**:
  - Need an endpoint to like/unlike a thread directly, similar to post reactions.
  - Payload: `{ threadId: string, emoji: string }`
  - Response: Should return updated reaction state or simply success to trigger refetch.

## Projects

Modify the endpoints returning the Project Details to return the following

```
winnerAnnouncement: string,
applied: boolean
owner: {
    id: string
    username: string
    firstName: string
    lastName: string
    companyName: string
    profilePicture: string
    companyLogo: string
    createdAt: string
    totalPaid: string
    totalBounties: number
    bio: string
    rating: string
}
milestones: {
  title: string
  description: string
  amount: string
  dueDate: string
}

```

- Bounty discussion UI
- My submissions UI and page functionality
- Submissions Page updating

- Come back and work on the Bounties Page filters
