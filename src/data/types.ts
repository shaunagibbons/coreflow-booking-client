// ── User ─────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string | null;
  is_instructor: boolean;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

export interface ProfileUpdateRequest {
  first_name: string;
  last_name: string;
  phone_number?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

// ── Instructor (nested in class responses) ───────────

export interface Instructor {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
}

// ── Pilates Class ────────────────────────────────────

export interface PilatesClass {
  id: number;
  title: string;
  description: string;
  instructor: Instructor;
  date: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  location: string;
  available_spots: number;
  is_full: boolean;
  can_book: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassFilters {
  date_from?: string;
  date_to?: string;
  instructor?: number;
  location?: string;
  available_only?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
}

// ── Booking ──────────────────────────────────────────

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: number;
  user: string;
  pilates_class: PilatesClass;
  status: BookingStatus;
  notes: string;
  can_cancel: boolean;
  booked_at: string;
  updated_at: string;
}

export interface BookingListItem {
  id: number;
  pilates_class: number;
  pilates_class_title: string;
  pilates_class_date: string;
  pilates_class_time: string;
  instructor_name: string;
  status: BookingStatus;
  booked_at: string;
  can_cancel: boolean;
}

export interface CreateBookingRequest {
  pilates_class: number;
  notes?: string;
}

// ── API Generics ─────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiErrorResponse {
  detail?: string;
  [key: string]: unknown;
}
