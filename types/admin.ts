export type RSVP = {
  id: string;
  attending: boolean;
  guest_count: number;
  additional_guests: { full_name: string; surname: string }[] | null;
  dietary_restrictions: string | null;
  song_request: string | null;
  halaal_preference: boolean;
  created_at: string;
  manual_entry?: boolean;
  manual_name?: string;
};

export interface Gift {
  id: number;
  name: string;
  available: boolean;
  claimed_by: string | null;
  image_url: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  role: string;
  headshot_url: string | null;
  quote: string | null;
}

export interface Profile {
  id: string;
  full_name: string | null;
}