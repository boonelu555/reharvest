export interface FoodListing {
  id: string;
  title: string;
  description: string;
  quantity: string;
  category: string;
  pickup_location: string;
  available_until: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
  provider_id: string;
  image_url?: string;
}
