export interface Message {
  id: string;
  type: 'message';
  fullName: string;
  email: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Booking {
  id: string;
  type: 'booking';
  fullName: string;
  email: string;
  date: string;
  time: string;
  message?: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export type Submission = Message | Booking;