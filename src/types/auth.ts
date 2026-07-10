export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  google_calendar_connected: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
