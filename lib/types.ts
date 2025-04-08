export type FormData = {
  fullName: string
  email: string
  phone: string
  attending: boolean | null
  guestCount: number
  additional_guests: { full_name: string; surname: string }[]

  selectedGift: number | null
  dietaryRestrictions: string
  songRequest: string
}

export type Gift = {
  id: number
  name: string
  available: boolean
}

export type RSVPRecord = {
  id: string
  attending: boolean
  guest_count: number
  additional_guests: { full_name: string; surname: string }[] | null

  dietary_restrictions: string | null
  song_request: string | null
  created_at: string
}
