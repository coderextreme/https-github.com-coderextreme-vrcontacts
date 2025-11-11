export interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  avatarUrl: string;
  email: string;
  phone: string;
}

export enum Recurrence {
  NONE = 'Does not repeat',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
}

export interface Meeting {
  id: string;
  title: string;
  time: Date;
  duration: number; // in minutes
  attendees: string[]; // array of contact IDs
  agenda: string;
  recurrence?: Recurrence;
}

export enum ViewType {
  CONTACTS = 'contacts',
  MEETINGS = 'meetings',
}

export interface Briefing {
    summary: string;
    attendeeBriefings: {
        name: string;
        brief: string;
    }[];
    talkingPoints: string[];
}
