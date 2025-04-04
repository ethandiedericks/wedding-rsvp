export interface RSVP {
    id: string;
    attending: boolean;
    guest_count: number;
    party_choice: "bachelor" | "bachelorette" | "none";
    gender: "male" | "female";
    dietary_restrictions: string | null;
    song_request: string | null;
  }
  
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