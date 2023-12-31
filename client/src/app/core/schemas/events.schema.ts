interface UserAttende {
  first_name: string;
  last_name: string;
  id: number;
}

interface EventAttendance {
  id: number;
  created_at: string;
  updated_at: string;
  user_attende_id: number;
  user_attende?: UserAttende;
  event_id: number;
  response_type: string;
}

export interface Event {
  userId: number;
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  start_date_time: string;
  end_date_time: string;
  color: string;
  deleted: boolean;
  daysOfWeek: string;
  all_day: boolean;
  event_owner_id: number;
  event_owner: {
    id: number;
    first_name: string;
    last_name: string;
  };
  Event_Attendance: EventAttendance[];
}
