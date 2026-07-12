export type TripType = 'ROAD_TRIP' | 'BIKE_RIDE' | 'TREKKING' | 'BACKPACKING' | 'WEEKEND' | 'INTERNATIONAL';
export type BudgetRange = 'BUDGET' | 'MODERATE' | 'LUXURY';
export type TripStatus = 'PLANNING' | 'CONFIRMED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type MemberRole = 'ORGANIZER' | 'MEMBER';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type GenderPreference = 'ANY' | 'MALE_ONLY' | 'FEMALE_ONLY';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

// 1. User Interface
export interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  profile?: Profile | null;
}

// 2. Profile Interface
export interface Profile {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  phoneNumber: string | null;
  gender: string | null;
  birthDate: string | null;
  isVerified: boolean;
  verificationDoc: string | null;
  rating: number;
  interests: string[];
  languages: string[];
  dietary: string;
  smoking: boolean;
  bikeType: string | null;
  ridingExperience: string | null;
  travelStyle: string | null;
  budgetPref: string | null;
  preferredDestinations: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// 3. Trip Interface
export interface Trip {
  id: string;
  title: string;
  description: string;
  type: TripType;
  startLocation: string;
  endLocation: string;
  startDate: string;
  endDate: string;
  budgetRange: BudgetRange;
  maxCapacity: number;
  isVerifiedOnly: boolean;
  genderPref: GenderPreference;
  vehicle: string | null;
  difficulty: Difficulty | null;
  languages: string[];
  status: TripStatus;
  ownerId: string;
  owner?: User;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  members?: TripMember[];
  requests?: TripRequest[];
  messages?: ChatMessage[];
  images?: TripImage[];
  startLat?: number | null;
  startLng?: number | null;
  endLat?: number | null;
  endLng?: number | null;
  routePath?: string | null;
  mapMarkers?: TripMapMarker[];
}

// 4. TripMember Interface
export interface TripMember {
  id: string;
  tripId: string;
  userId: string;
  role: MemberRole;
  joinedAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user?: User;
  latitude?: number | null;
  longitude?: number | null;
  shareLocation?: boolean;
  locationUpdatedAt?: string | null;
}

// 5. TripRequest Interface
export interface TripRequest {
  id: string;
  tripId: string;
  userId: string;
  status: RequestStatus;
  message: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// 5.5 TripMapMarker Interface
export interface TripMapMarker {
  id: string;
  tripId: string;
  title: string;
  description: string | null;
  lat: number;
  lng: number;
  type: string; // MEETING_POINT, REST_STOP, HAZARD, PHOTO_OP, CUSTOM
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

// 6. ChatMessage Interface
export interface ChatMessage {
  id: string;
  tripId: string;
  senderId: string;
  content: string;
  fileUrl: string | null;
  fileType: string | null;
  createdAt: string;
  deletedAt: string | null;
  sender?: User;
}

// 7. Review Interface
export interface Review {
  id: string;
  tripId: string | null;
  reviewerId: string;
  revieweeId: string;
  ratingValue: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  ratings?: Rating[];
  reviewer?: User;
  reviewee?: User;
}

// 8. Rating Interface
export interface Rating {
  id: string;
  reviewId: string;
  category: 'SAFETY' | 'COMMUNICATION' | 'DRIVING' | 'FRIENDLINESS' | 'PUNCTUALITY' | 'OVERALL_EXPERIENCE';
  score: number;
  createdAt: string;
}

// 9. Notification Interface
export interface Notification {
  id: string;
  userId: string;
  senderId: string | null;
  type: 'TRIP_REQUEST' | 'TRIP_ACCEPT' | 'CHAT_MESSAGE' | 'REVIEW_RECEIVED';
  title: string;
  content: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
  sender?: User | null;
}

// 10. Report Interface
export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string | null;
  reportedTripId: string | null;
  category: string;
  reason: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  updatedAt: string;
}

// 11. BlockedUser Interface
export interface BlockedUser {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: string;
}

// 12. TripImage Interface
export interface TripImage {
  id: string;
  tripId: string;
  imageUrl: string;
  uploadedById: string;
  createdAt: string;
}

// Combined interface for UI components
export interface UserProfile extends Profile {
  email: string;
  role: string;
}

// 13. ChatReadState Interface
export interface ChatReadState {
  id: string;
  tripId: string;
  userId: string;
  lastReadAt: string;
}

