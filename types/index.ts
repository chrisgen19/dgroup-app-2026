// --- Union Types ---

export type UserRole = 'Leader' | 'Apprentice' | 'Member';

export type PostType = 'announcement' | 'devotional';

export type ViewType = 'auth' | 'home' | 'discover' | 'group-detail' | 'create';

export type TabType = 'feed' | 'chat' | 'prayer' | 'members';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export type AvatarSize = 'sm' | 'md' | 'lg';

export type ChipColor = 'slate' | 'indigo' | 'green' | 'orange';

export type LocationType = 'Online' | 'Face to Face' | 'Hybrid';

export type GroupStatus = 'Public' | 'Private';

export type LifeStage = 'Single Professional' | 'Single' | 'Married' | 'Parent';

// --- Interfaces ---

export interface User {
  id: string;
  name: string;
  avatar: string | null;
  email: string;
  lifeStage: LifeStage;
  satellite: string;
}

export const LIFE_STAGE_LABELS: Record<string, LifeStage> = {
  SINGLE: 'Single',
  SINGLE_PROFESSIONAL: 'Single Professional',
  MARRIED: 'Married',
  PARENT: 'Parent',
};

export interface GroupMember {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface PrayerRequest {
  id: string;
  userId: string;
  userName: string;
  content: string;
  count: number;
  answered: boolean;
  date: string;
}

export interface Post {
  id: string;
  type: PostType;
  title: string;
  content: string;
  author: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  name: string;
  message: string;
  time: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  leaderName: string;
  schedule: string;
  location: string;
  type: string;
  members: GroupMember[];
  prayers: PrayerRequest[];
  posts: Post[];
  chat: ChatMessage[];
}

// --- Component Props ---

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  disabled?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface AvatarProps {
  name: string;
  size?: AvatarSize;
  className?: string;
}

export interface ChipProps {
  label: string;
  color?: ChipColor;
}

export interface ToastProps {
  message: string;
}

export interface MeetingAssistantProps {
  onClose: () => void;
  groupName: string;
}

export interface NavBarProps {
  view: ViewType;
  currentUser: User;
  onNavigate: (view: ViewType) => void;
  onLogout: () => void;
}

export interface AuthViewProps {
  onSignIn: (user: User) => void;
}

export interface HomeViewProps {
  currentUser: User;
  myGroups: Group[];
  onSelectGroup: (group: Group) => void;
  onNavigate: (view: ViewType) => void;
}

export interface DiscoverViewProps {
  availableGroups: Group[];
  onJoinGroup: (group: Group) => void;
  showToast: (message: string) => void;
}

export interface CreateGroupViewProps {
  onCreated: () => void;
  showToast: (message: string) => void;
}

export interface GroupDetailViewProps {
  group: Group;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onBack: () => void;
  onStartMeeting: () => void;
  showToast: (message: string) => void;
}
