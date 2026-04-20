
export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  qrCode: string;
}

export interface AttendanceRecord {
  id: string;
  volunteerId: string;
  volunteerName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  duration?: string;
}

export const mockVolunteers: Volunteer[] = [
  {
    id: '1',
    name: 'Juan Dela Cruz',
    email: 'juan@example.com',
    phone: '0917-123-4567',
    role: 'Security',
    qrCode: 'VOL-1001',
  },
  {
    id: '2',
    name: 'Maria Clara',
    email: 'maria@example.com',
    phone: '0918-765-4321',
    role: 'Medical Team',
    qrCode: 'VOL-1002',
  },
  {
    id: '3',
    name: 'Jose Rizal',
    email: 'jose@example.com',
    phone: '0919-000-1111',
    role: 'Crowd Control',
    qrCode: 'VOL-1003',
  },
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: 'a1',
    volunteerId: '1',
    volunteerName: 'Juan Dela Cruz',
    date: '2026-03-10',
    checkIn: '08:00 AM',
    checkOut: '05:00 PM',
    duration: '9h',
  },
  {
    id: 'a2',
    volunteerId: '2',
    volunteerName: 'Maria Clara',
    date: '2026-03-10',
    checkIn: '08:15 AM',
    checkOut: '04:30 PM',
    duration: '8h 15m',
  },
];
