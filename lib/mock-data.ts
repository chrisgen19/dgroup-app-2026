import type { User, Group } from '@/types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Josh Reyes',
  avatar: 'JR',
  email: 'josh@example.com',
  lifeStage: 'Single Professional',
  satellite: 'CCF Main',
};

export const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Friday Night Lights',
    description:
      'A community of young professionals seeking growth in Christ. Dinner & Discussion.',
    leaderId: 'u2',
    leaderName: 'Mark D.',
    schedule: 'Fridays, 7:00 PM',
    location: 'Ortigas / Hybrid',
    type: 'B1G (Singles)',
    members: [
      { id: 'u1', name: 'Josh Reyes', role: 'Member', avatar: 'JR' },
      { id: 'u2', name: 'Mark D.', role: 'Leader', avatar: 'MD' },
      { id: 'u3', name: 'Sarah L.', role: 'Apprentice', avatar: 'SL' },
      { id: 'u4', name: 'Mike T.', role: 'Member', avatar: 'MT' },
    ],
    prayers: [
      {
        id: 'p1',
        userId: 'u3',
        userName: 'Sarah L.',
        content: 'Pray for my board exam results next week.',
        count: 5,
        answered: false,
        date: '2h ago',
      },
      {
        id: 'p2',
        userId: 'u4',
        userName: 'Mike T.',
        content: "Thank God for my grandmother's recovery!",
        count: 12,
        answered: true,
        date: '1d ago',
      },
    ],
    posts: [
      {
        id: 'po1',
        type: 'announcement',
        title: 'Retreat Registration',
        content:
          "Guys, don't forget to sign up for the B1G Retreat! Deadline is on Sunday.",
        author: 'Mark D.',
        date: '3h ago',
      },
      {
        id: 'po2',
        type: 'devotional',
        title: 'Morning Verse',
        content:
          'Isaiah 40:31 - But those who hope in the LORD will renew their strength.',
        author: 'Mark D.',
        date: '1d ago',
      },
    ],
    chat: [
      {
        id: 'c1',
        userId: 'u2',
        name: 'Mark D.',
        message: 'See you all later! Bring snacks 🍕',
        time: '5:30 PM',
      },
      {
        id: 'c2',
        userId: 'u3',
        name: 'Sarah L.',
        message: "I'll bring chips!",
        time: '5:35 PM',
      },
    ],
  },
  {
    id: 'g2',
    name: 'Sunday Couples',
    description:
      'Navigating marriage and parenting through biblical principles.',
    leaderId: 'u5',
    leaderName: 'Ptr. Ray',
    schedule: 'Sundays, 2:00 PM',
    location: 'Alabang',
    type: 'Couples',
    members: [],
    prayers: [],
    posts: [],
    chat: [],
  },
  {
    id: 'g3',
    name: 'Elevate High',
    description: 'High school students passionate about Jesus.',
    leaderId: 'u6',
    leaderName: 'Coach Tim',
    schedule: 'Saturdays, 3:00 PM',
    location: 'Quezon City',
    type: 'Youth',
    members: [],
    prayers: [],
    posts: [],
    chat: [],
  },
];
