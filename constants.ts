import type { Contact, Meeting } from './types';
import { Recurrence } from './types';

export const CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Aria Montgomery',
    title: 'Lead Product Manager',
    company: 'Innovate Inc.',
    avatarUrl: 'https://picsum.photos/seed/c1/200',
    email: 'aria.m@innovate.com',
    phone: '555-0101',
  },
  {
    id: 'c2',
    name: 'Ben Carter',
    title: 'Senior UX Designer',
    company: 'Creative Solutions',
    avatarUrl: 'https://picsum.photos/seed/c2/200',
    email: 'ben.c@creative.com',
    phone: '555-0102',
  },
  {
    id: 'c3',
    name: 'Chloe Davis',
    title: 'Head of Engineering',
    company: 'Tech Forward',
    avatarUrl: 'https://picsum.photos/seed/c3/200',
    email: 'chloe.d@techforward.com',
    phone: '555-0103',
  },
  {
    id: 'c4',
    name: 'David Evans',
    title: 'Marketing Director',
    company: 'Innovate Inc.',
    avatarUrl: 'https://picsum.photos/seed/c4/200',
    email: 'david.e@innovate.com',
    phone: '555-0104',
  },
];

export const MEETINGS: Meeting[] = [
  {
    id: 'm1',
    title: 'Project Phoenix Kick-off',
    time: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
    duration: 60,
    attendees: ['c1', 'c3'],
    agenda: 'Initial planning and role assignment for the new Phoenix project. Discuss timelines and initial milestones.',
    recurrence: Recurrence.NONE,
  },
  {
    id: 'm2',
    title: 'Q3 Design Review',
    time: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 1 day from now
    duration: 90,
    attendees: ['c1', 'c2', 'c4'],
    agenda: 'Review the latest UX mockups and marketing materials for the Q3 launch. Finalize design language and branding.',
    recurrence: Recurrence.WEEKLY,
  },
  {
    id: 'm3',
    title: 'Engineering Sync-up',
    time: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    duration: 45,
    attendees: ['c3'],
    agenda: 'Weekly technical sync to discuss progress, blockers, and upcoming sprint priorities.',
    recurrence: Recurrence.NONE,
  },
];
