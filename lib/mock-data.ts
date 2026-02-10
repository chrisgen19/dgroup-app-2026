import type { User } from '@/types';

// Keep CURRENT_USER for reference/fallback (used by mock chat/posts/prayers in Phase 4)
export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Josh Reyes',
  avatar: 'JR',
  email: 'josh@example.com',
  lifeStage: 'Single Professional',
  satellite: 'CCF Main',
};

// MOCK_GROUPS removed — groups are now fetched from the database via API.
// Mock data for chat, posts, and prayers will be added in Phase 4.
