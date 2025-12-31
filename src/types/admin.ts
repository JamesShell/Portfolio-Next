export interface Message {
  id: string;
  type: 'message';
  fullName: string;
  email: string;
  subject: string;
  body: string;
  plan?: string | null;
  timestamp: string;
  read: boolean;
}

export interface Booking {
  id: string;
  type: 'booking';
  fullName: string;
  email: string;
  company?: string;
  date: string;
  time: string;
  notes?: string;
  plan: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export type Submission = Message | Booking;

export interface Project {
  id: string;
  name: string;
  short_description: string;
  description: string;
  type: string;
  tags: { name: string; color: string }[];
  image: string;
  video?: string;
  link: string;
  source_code_link?: string;
  createdAt?: string;
}