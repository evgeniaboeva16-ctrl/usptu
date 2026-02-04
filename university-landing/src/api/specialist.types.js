export const EventType = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  HYBRID: 'hybrid'
}

export const EventFormat = {
  MASTER_CLASS: 'master_class',
  EXCURSION: 'excursion',
  OPEN_DAY: 'open_day',
  OLYMPIAD: 'olympiad',
  WORKSHOP: 'workshop',
  LECTURE: 'lecture',
  CONSULTATION: 'consultation'
}

export const EventStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  REGISTRATION_OPEN: 'registration_open',
  REGISTRATION_CLOSED: 'registration_closed',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ARCHIVED: 'archived'
}

export const MaterialType = {
  PRESENTATION: 'presentation',
  BROCHURE: 'brochure',
  VIDEO: 'video',
  RECORDING: 'recording',
  TASK: 'task',
  INSTRUCTION: 'instruction',
  CERTIFICATE: 'certificate',
  OTHER: 'other'
}

export const ApiResponse = {
  success: Boolean,
  data: Object,
  message: String,
  error: String
}

export const Event = {
  id: Number,
  title: String,
  description: String,
  short_description: String,
  type: EventType,
  format: EventFormat,
  category: String,
  start_datetime: String,
  end_datetime: String,
  registration_start: String,
  registration_end: String,
  status: EventStatus,
  location_type: String,
  address: String,
  online_link: String,
  max_participants: Number,
  min_participants: Number,
  current_participants: Number,
  budget: Number,
  cost_per_participant: Number,
  created_by: Number,
  created_at: String,
  updated_at: String
}

export const Participant = {
  id: Number,
  event_id: Number,
  user_id: Number,
  status: String,
  registration_date: String,
  attendance_date: String,
  feedback_submitted: Boolean,
  certificate_issued: Boolean,
  user: {
    id: Number,
    email: String,
    full_name: String,
    school: String,
    grade: Number,
    phone: String
  }
}