export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_featured: boolean;
  is_on_sale: boolean;
  sale_price: number | null;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type TrackingStatus = 'pending' | 'confirmed' | 'packaging' | 'shipping' | 'delivered' | 'picked_up';

export const TRACKING_STATUSES: { value: TrackingStatus; label: string; description: string }[] = [
  { value: 'pending', label: 'Pending', description: 'Order received, awaiting confirmation' },
  { value: 'confirmed', label: 'Confirmed', description: 'Order confirmed and being processed' },
  { value: 'packaging', label: 'Packaging', description: 'Your order is being packaged' },
  { value: 'shipping', label: 'Out for Delivery', description: 'Your order is on its way' },
  { value: 'delivered', label: 'Delivered', description: 'Your order has been delivered' },
  { value: 'picked_up', label: 'Picked Up', description: 'Order picked up by customer' },
];

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  items: CartItem[];
  total_amount: number;
  status: string;
  created_at: string;
  delivery_address: string | null;
  delivery_city: string | null;
  delivery_state: string | null;
  delivery_zip: string | null;
  delivery_country: string | null;
  delivery_instructions: string | null;
  alt_contact_name: string | null;
  alt_contact_phone: string | null;
  payment_method: string | null;
  tracking_status: TrackingStatus;
  tracking_number: string | null;
  latitude: number | null;
  longitude: number | null;
}
