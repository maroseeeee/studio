
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

export const mockVolunteers: Volunteer[] = [];

export const mockAttendance: AttendanceRecord[] = [];
