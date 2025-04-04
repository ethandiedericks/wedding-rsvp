export type FormData = {
  fullName: string;
  email: string;
  phone: string;
  attending: boolean | null;
  guestCount: number;
  gender: "male" | "female" | null;
  partyChoice: "bachelor" | "bachelorette" | "none";
  selectedGift: number | null;
  dietaryRestrictions: string;
  songRequest: string;
};

export type Gift = {
  id: number;
  name: string;
  available: boolean;
};

export type RSVPRecord = {
  id: string;
  attending: boolean;
  guest_count: number;
  party_choice: "bachelor" | "bachelorette" | "none";
  gender: "male" | "female";
  dietary_restrictions: string | null;
  song_request: string | null;
  created_at: string;
};