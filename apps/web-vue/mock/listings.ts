/**
 * Mock listing catalogue for the guest surface.
 *
 * Temporary: it stands in for the listing/search/review API described in
 * specs/canmorestays/08-data-model. Every public store reads from here, so
 * swapping in the real queries is a change in the stores, not the components.
 */

export type ListingCategory = 'residential' | 'other';

export interface ListingReview {
  id: string;
  author: string;
  rating: number;
  /** e.g. "February 2026" — display form, matching the reference site. */
  postedOn: string;
  body: string;
}

export interface PublicListing {
  id: string;
  title: string;
  /** Property type shown above the guest/bedroom/bathroom line. */
  propertyType: string;
  category: ListingCategory;
  location: string;
  rating: number | null;
  reviewCount: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  nightlyRate: number;
  /** Up to 3 are rendered as tags on the card; the rest show on the detail page. */
  amenities: string[];
  /** Number of photos in the gallery — the grid renders placeholders. */
  photoCount: number;
  description: string;
  houseRules: { checkIn: string; checkOut: string; pets: string; smoking: string };
  cancellationPolicy: string[];
  reviews: ListingReview[];
}

const REVIEWS: ListingReview[] = [
  {
    id: 'rv_1',
    author: 'Sharon Hobbs',
    rating: 5,
    postedOn: 'February 2026',
    body: 'Beautiful property. Space was laid out well. Kitchen was lovely to cook in. Hosts quickly answered questions before we arrived and gave very good check in/out instructions.',
  },
  {
    id: 'rv_2',
    author: 'Johanna Calgie-Brancati',
    rating: 1,
    postedOn: 'January 2026',
    body: 'Host seemed attentive. Communication with the host was good prior to check-in. I asked for early check-in and was not granted it, which was fine, but check-in time was emailed late.',
  },
  {
    id: 'rv_3',
    author: 'Christopher Smith',
    rating: 5,
    postedOn: 'October 2025',
    body: "Our family was celebrating my Father's 80th birthday and this was the perfect place for three generations to gather. The house is exactly as advertised and has all the comforts of home.",
  },
];

const HOUSE_RULES = {
  checkIn: '4 pm',
  checkOut: '10 am',
  pets: 'not allowed',
  smoking: 'not allowed',
};

const CANCELLATION = [
  '100% refund up to 2 days after reservation',
  '50% refund up to 14 days before arrival',
];

function listing(
  id: string,
  title: string,
  rating: number,
  maxGuests: number,
  bedrooms: number,
  bathrooms: number,
  nightlyRate: number,
  amenities: string[],
  category: ListingCategory = 'other',
): PublicListing {
  return {
    id,
    title,
    propertyType: 'Villa',
    category,
    location: 'Canmore, AB',
    rating,
    reviewCount: REVIEWS.length,
    maxGuests,
    bedrooms,
    bathrooms,
    nightlyRate,
    amenities,
    photoCount: 56,
    description:
      'Mission: make every stay a 5-star experience. 24/7 host availability, WIFI, Disney+, Netflix and Crave, pro cleaners with a 60-point checklist, amazing views, hot tub, BBQ, private balcony, kitchen, parking and laundry.',
    houseRules: HOUSE_RULES,
    cancellationPolicy: CANCELLATION,
    reviews: REVIEWS,
  };
}

export const LISTINGS: PublicListing[] = [
  listing('355029', 'The Peak Retreat: NEW Luxe 5BR Mtn Views + Hot Tub', 5.0, 16, 5, 4, 892, ['Free WiFi', 'Kitchen', 'Air conditioning'], 'residential'),
  listing('355030', 'Mountain View | 3BR Penthouse | Private Balconies', 4.9, 9, 3, 2, 465, ['Swimming pool', 'Free WiFi', 'Kitchen']),
  listing('355031', 'Luxury 1750sf Condo In DT Canmore | Sleeps 10', 5.0, 10, 3, 2, 512, ['Free WiFi', 'Kitchen', 'Air conditioning'], 'residential'),
  listing('355032', '2BR Modern Luxe Condo w/ Hot Tub + Views!', 4.9, 7, 2, 2, 328, ['Free WiFi', 'Kitchen', 'Air conditioning']),
  listing('355033', '4BR Luxury w/ Pvt Hottub in the Heart of Canmore', 4.65, 16, 4, 3, 704, ['Kitchen', 'Washing Machine', 'Suitable for children']),
  listing('355034', 'LUXUS 4BR Penthouse | 2500sqft + Private Hot Tub', 4.95, 14, 4, 2, 815, ['Swimming pool', 'Free WiFi', 'Kitchen'], 'residential'),
  listing('355035', 'Rockies Escape for Groups w/ Hot tub & Pool', 4.95, 14, 5, 3, 736, ['Swimming pool', 'Free WiFi', 'Kitchen']),
  listing('355036', 'Mountain View Penthouse: 3BR with Private Hot Tub!', 4.95, 16, 3, 2, 588, ['Swimming pool', 'Free WiFi', 'Kitchen']),
  listing('355037', 'Luxury 4BR + Hot Tub, Mtn Views | 10Min Walk to DT', 4.9, 10, 4, 4, 690, ['Free WiFi', 'Kitchen', 'Air conditioning'], 'residential'),
  listing('355038', 'Stylish 4BR Near DT | Balcony, Mtn View, Sleeps 14', 4.9, 14, 4, 2, 654, ['Free WiFi', 'Kitchen', 'Air conditioning']),
  listing('355039', 'Luxurious Condo | Mountain Views | Hot-tub | Billiards', 4.9, 8, 2, 2, 402, ['Free WiFi', 'Kitchen', 'Air conditioning']),
  listing('355040', 'Family Retreat: 2BR+Studio | Pool, Hot Tub Sleeps 10!', 4.9, 10, 3, 3, 545, ['Swimming pool', 'Kitchen', 'Air conditioning']),
  listing('355041', 'Stunning Top Floor Luxury Suite w/ Mountain Views!', 4.95, 6, 2, 2, 289, ['Swimming pool', 'Kitchen', 'Air conditioning']),
  listing('355042', 'Serene 3BR Rockies Stay w/ Hot Tub & Near DT', 4.9, 11, 3, 2, 498, ['Kitchen', 'Air conditioning', 'Washing Machine']),
  listing('355043', 'Mountain Views Lux 2BR Condo in Canmore w/ Hot Tub', 5.0, 6, 2, 2, 315, ['Free WiFi', 'Kitchen', 'Air conditioning'], 'residential'),
  listing('355044', 'Spectacular 3BR Mountain Views w/ Hot Tub & Gym', 4.95, 8, 3, 2, 472, ['Free WiFi', 'Kitchen', 'Washing Machine']),
  listing('355045', 'Classic Modern 4BR Nearby DT | Hot tub & Pool', 5.0, 12, 4, 2, 668, ['Swimming pool', 'Free WiFi', 'Kitchen']),
  listing('355046', 'Mountain View Penthouse w/ Pool & Hot Tub', 4.95, 12, 2, 2, 430, ['Swimming pool', 'Free WiFi', 'Kitchen'], 'residential'),
];

/** The reference site advertises a far larger inventory than the mock holds. */
export const TOTAL_PROPERTY_COUNT = 387;
export const RESIDENTIAL_PROPERTY_COUNT = 9;

/** Amenity quick-filter chips under the home hero search. */
export const QUICK_FILTER_AMENITIES = ['Kitchen', 'Hot tub', 'Free parking', 'Pool'];

/** The full amenity list shown on a listing detail page. */
export const ALL_AMENITIES = [
  'Free WiFi',
  'Kitchen',
  'Air conditioning',
  'Washing Machine',
  'Hot tub',
  'Suitable for children',
];
