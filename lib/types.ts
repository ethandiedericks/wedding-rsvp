export type FormData = {
  fullName: string
  email: string
  phone: string
  attending: boolean | null
  guestCount: number
  additional_guests: { full_name: string; surname: string }[]

  selectedGift: number | null
  songRequest: string
  halaalPreference: boolean
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

  song_request: string | null
  halaal_preference: boolean
  created_at: string
}
