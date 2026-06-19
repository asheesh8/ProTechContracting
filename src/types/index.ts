export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  category: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Review {
  author_name: string
  profile_photo_url: string
  rating: number
  text: string
  relative_time_description: string
}

export interface PlaceDetails {
  name: string
  rating: number
  user_ratings_total: number
  reviews: Review[]
}

export type ServiceCategory =
  | 'Remodeling'
  | 'Restoration'
  | 'Tips & Advice'
  | 'Project Spotlight'
  | 'News'
  | 'Other'
