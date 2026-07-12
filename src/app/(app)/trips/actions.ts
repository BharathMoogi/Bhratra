'use server';

import prisma from '@/lib/db';
import { getSupabaseServerClient, getCachedUser } from '@/lib/supabase-server';
import { tripSchema, updateTripSchema, TripInput, UpdateTripInput } from '@/lib/validation/trip';
import { revalidatePath } from 'next/cache';
import { TripType, BudgetRange, TripStatus, RequestStatus, Difficulty } from '@/types';
import { calculateCompatibility } from '@/lib/matching';

// Create a new Trip (runs in transaction to auto-add creator as Organizer)
export async function createTripAction(formData: TripInput) {
  const result = tripSchema.safeParse(formData);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  try {
    const {
      title,
      description,
      type,
      startLocation,
      endLocation,
      startDate,
      endDate,
      budgetRange,
      maxCapacity,
      isVerifiedOnly,
      genderPref,
      vehicle,
      difficulty,
      languages,
    } = result.data;

    // Run inside database transaction to guarantee database consistency
    const trip = await prisma.$transaction(async (tx) => {
      // 1. Insert the new Trip
      const createdTrip = await tx.trip.create({
        data: {
          title,
          description,
          type,
          startLocation,
          endLocation,
          startDate,
          endDate,
          budgetRange,
          maxCapacity,
          isVerifiedOnly,
          genderPref,
          vehicle: vehicle || null,
          difficulty: difficulty || null,
          languages: languages || [],
          ownerId: user.id,
          status: 'PLANNING',
        },
      });

      // 2. Automatically register the owner as the Organizer in TripMember
      await tx.tripMember.create({
        data: {
          tripId: createdTrip.id,
          userId: user.id,
          role: 'ORGANIZER',
        },
      });

      return createdTrip;
    });

    revalidatePath('/trips');
    return { success: true, tripId: trip.id };
  } catch (err: any) {
    console.error('Create trip database error:', err);
    return { error: err.message || 'Failed to publish trip request.' };
  }
}

// Edit/Update Trip
export async function updateTripAction(tripId: string, formData: UpdateTripInput) {
  const result = updateTripSchema.safeParse(formData);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  try {
    // 1. Verify trip existence and ownership
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, deletedAt: null },
    });

    if (!trip) {
      return { error: 'Trip not found or has been deleted.' };
    }

    if (trip.ownerId !== user.id) {
      return { error: 'Access denied. Only the organizer can modify this trip.' };
    }

    // 2. Perform database update
    await prisma.trip.update({
      where: { id: tripId },
      data: {
        title: result.data.title,
        description: result.data.description,
        type: result.data.type,
        startLocation: result.data.startLocation,
        endLocation: result.data.endLocation,
        startDate: result.data.startDate,
        endDate: result.data.endDate,
        budgetRange: result.data.budgetRange,
        maxCapacity: result.data.maxCapacity,
        isVerifiedOnly: result.data.isVerifiedOnly,
        genderPref: result.data.genderPref,
        vehicle: result.data.vehicle || null,
        difficulty: result.data.difficulty || null,
        languages: result.data.languages || [],
      },
    });

    revalidatePath(`/trips/${tripId}`);
    revalidatePath('/trips');
    return { success: true };
  } catch (err: any) {
    console.error('Update trip database error:', err);
    return { error: 'Failed to update trip details.' };
  }
}

// Soft Delete Trip
export async function deleteTripAction(tripId: string) {
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  try {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, deletedAt: null },
    });

    if (!trip) {
      return { error: 'Trip not found or already deleted.' };
    }

    if (trip.ownerId !== user.id) {
      return { error: 'Access denied. Only the organizer can delete this trip.' };
    }

    // Soft delete the trip
    await prisma.trip.update({
      where: { id: tripId },
      data: {
        deletedAt: new Date(),
      },
    });

    revalidatePath('/trips');
    return { success: true };
  } catch (err: any) {
    console.error('Delete trip error:', err);
    return { error: 'Failed to delete trip.' };
  }
}

// Join Request (Create TripRequest)
export async function joinTripAction(tripId: string, applicantMessage?: string) {
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  try {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, deletedAt: null },
      include: {
        members: true,
      },
    });

    if (!trip) {
      return { error: 'Trip not found.' };
    }

    if (trip.ownerId === user.id) {
      return { error: 'You are the organizer of this trip.' };
    }

    // 1. Check verified-only rule
    if (trip.isVerifiedOnly) {
      const profile = await prisma.profile.findUnique({
        where: { id: user.id },
      });
      if (!profile || !profile.isVerified) {
        return { error: 'This trip requires a verified traveler profile badge to apply.' };
      }
    }

    // 2. Check seats availability
    const approvedCount = trip.members.length; // Includes organizer
    if (approvedCount >= trip.maxCapacity) {
      return { error: 'This trip is already full.' };
    }

    // 3. Check existing requests
    const existingRequest = await prisma.tripRequest.findUnique({
      where: {
        tripId_userId: {
          tripId,
          userId: user.id,
        },
      },
    });

    if (existingRequest) {
      return { error: `You have already sent a request (Status: ${existingRequest.status}).` };
    }

    // 4. Create the join request
    await prisma.tripRequest.create({
      data: {
        tripId,
        userId: user.id,
        status: 'PENDING',
        message: applicantMessage || null,
      },
    });

    // 5. Trigger in-app notification for the trip owner (non-fatal)
    try {
      await prisma.notification.create({
        data: {
          userId: trip.ownerId,
          senderId: user.id,
          type: 'TRIP_REQUEST',
          title: 'New Join Request',
          content: `A traveler wants to join your trip: "${trip.title}"`,
          link: `/trips/${tripId}`,
        },
      });
    } catch (notifErr) {
      console.error('Notification creation failed (non-fatal):', notifErr);
    }

    revalidatePath(`/trips/${tripId}`);
    revalidatePath('/trips');
    return { success: true };
  } catch (err: any) {
    console.error('Join trip error:', err);
    return { error: err?.message || 'Failed to send join request.' };
  }
}

// Cancel Request / Leave Group
export async function cancelJoinRequestAction(tripId: string) {
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  try {
    // 1. Remove any pending/rejected requests
    const deleteRequest = prisma.tripRequest.deleteMany({
      where: {
        tripId,
        userId: user.id,
      },
    });

    // 2. Remove from memberships (if already accepted)
    const deleteMembership = prisma.tripMember.deleteMany({
      where: {
        tripId,
        userId: user.id,
        role: 'MEMBER', // Organizer cannot leave their own trip
      },
    });

    await prisma.$transaction([deleteRequest, deleteMembership]);

    revalidatePath(`/trips/${tripId}`);
    return { success: true };
  } catch (err: any) {
    console.error('Cancel request error:', err);
    return { error: 'Failed to cancel request or leave trip.' };
  }
}

// Accept or Reject Request (Owner only)
export async function manageJoinRequestAction(requestId: string, approve: boolean) {
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  try {
    const request = await prisma.tripRequest.findUnique({
      where: { id: requestId },
      include: {
        trip: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!request || request.trip.deletedAt) {
      return { error: 'Request not found.' };
    }

    if (request.trip.ownerId !== user.id) {
      return { error: 'Access denied. Only the trip organizer can manage requests.' };
    }

    if (approve) {
      // Check capacity
      if (request.trip.members.length >= request.trip.maxCapacity) {
        return { error: 'This trip is already at maximum capacity.' };
      }

      await prisma.$transaction([
        // Approve request
        prisma.tripRequest.update({
          where: { id: requestId },
          data: { status: 'APPROVED' },
        }),
        // Add to members
        prisma.tripMember.create({
          data: {
            tripId: request.tripId,
            userId: request.userId,
            role: 'MEMBER',
          },
        }),
      ]);

      // Notify applicant (non-fatal)
      try {
        await prisma.notification.create({
          data: {
            userId: request.userId,
            senderId: user.id,
            type: 'TRIP_ACCEPT',
            title: 'Trip Request Approved',
            content: `Your request to join "${request.trip.title}" was approved!`,
            link: `/trips/${request.tripId}`,
          },
        });
      } catch (notifErr) {
        console.error('Failed to create approval notification (non-fatal):', notifErr);
      }
    } else {
      // Reject request
      await prisma.tripRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' },
      });

      // Notify applicant (non-fatal)
      try {
        await prisma.notification.create({
          data: {
            userId: request.userId,
            senderId: user.id,
            type: 'TRIP_ACCEPT',
            title: 'Trip Request Rejected',
            content: `Your request to join "${request.trip.title}" was declined by the organizer.`,
            link: `/trips/${request.tripId}`,
          },
        });
      } catch (notifErr) {
        console.error('Failed to create rejection notification (non-fatal):', notifErr);
      }
    }

    revalidatePath(`/trips/${request.tripId}`);
    return { success: true };
  } catch (err: any) {
    console.error('Manage request error:', err);
    return { error: 'Failed to process request action.' };
  }
}

// List / Query paginated trips with advanced filtering parameters
export async function listTripsAction(
  filters: {
    destination?: string;
    budget?: BudgetRange;
    date?: string;
    vehicle?: string;
    language?: string;
    tripType?: TripType;
    difficulty?: Difficulty;
    seats?: number;
    genderPref?: 'ANY' | 'MALE_ONLY' | 'FEMALE_ONLY';
  },
  page: number = 1,
  limit: number = 6,
  sortBy?: 'LATEST' | 'HIGHEST_RATED' | 'NEAREST' | 'MOST_SEATS' | 'LOWEST_BUDGET'
) {
  try {
    const whereClause: any = {
      deletedAt: null,
    };

    if (filters.destination) {
      whereClause.OR = [
        { endLocation: { contains: filters.destination, mode: 'insensitive' } },
        { startLocation: { contains: filters.destination, mode: 'insensitive' } },
        { title: { contains: filters.destination, mode: 'insensitive' } },
      ];
    }

    if (filters.budget) {
      whereClause.budgetRange = filters.budget;
    }

    if (filters.date) {
      const selectedDate = new Date(filters.date);
      whereClause.startDate = {
        gte: selectedDate,
      };
    }

    if (filters.vehicle) {
      whereClause.vehicle = { contains: filters.vehicle, mode: 'insensitive' };
    }

    if (filters.tripType) {
      whereClause.type = filters.tripType;
    }

    if (filters.difficulty) {
      whereClause.difficulty = filters.difficulty;
    }

    if (filters.language) {
      whereClause.languages = {
        has: filters.language,
      };
    }

    if (filters.genderPref) {
      whereClause.genderPref = filters.genderPref;
    }

    // Build dynamic sort order
    let orderByClause: any = { startDate: 'asc' }; // default nearest

    if (sortBy === 'LATEST') {
      orderByClause = { createdAt: 'desc' };
    } else if (sortBy === 'HIGHEST_RATED') {
      orderByClause = {
        owner: {
          profile: {
            rating: 'desc',
          },
        },
      };
    } else if (sortBy === 'NEAREST') {
      orderByClause = { startDate: 'asc' };
    } else if (sortBy === 'MOST_SEATS') {
      orderByClause = { maxCapacity: 'desc' };
    } else if (sortBy === 'LOWEST_BUDGET') {
      orderByClause = { budgetRange: 'asc' }; // BUDGET -> LUXURY -> MODERATE
    }

    // Query elements
    const [trips, totalCount] = await prisma.$transaction([
      prisma.trip.findMany({
        where: whereClause,
        include: {
          owner: {
            include: {
              profile: true,
            },
          },
          members: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: orderByClause,
      }),
      prisma.trip.count({ where: whereClause }),
    ]);

    // Available seats filter (post-processing filter)
    let filteredTrips = trips;
    if (filters.seats !== undefined && filters.seats > 0) {
      filteredTrips = trips.filter(
        (trip) => trip.maxCapacity - trip.members.length >= (filters.seats || 1)
      );
    }

    // Fetch logged-in user profile to calculate compatibility
    const user = await getCachedUser();
    let userProfile = null;
    if (user) {
      userProfile = await prisma.profile.findUnique({
        where: { id: user.id },
      });
    }

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      // Serialize only the Date fields that Next.js cannot pass across the server/client boundary.
      // Much faster than a full JSON.parse(JSON.stringify()) deep-clone of the whole result set.
      trips: filteredTrips.map((trip) => {
        const compatibility = userProfile ? calculateCompatibility(userProfile, trip) : null;
        return {
          ...trip,
          startDate: trip.startDate.toISOString(),
          endDate: trip.endDate.toISOString(),
          createdAt: trip.createdAt.toISOString(),
          updatedAt: trip.updatedAt.toISOString(),
          compatibility,
        };
      }),
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (err: any) {
    console.error('List trips action error:', err);
    return { error: 'Failed to fetch trips from server.' };
  }
}

// Save or update coordinates and route path for a trip
export async function saveTripCoordinatesAction(
  tripId: string,
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  routePath: string | null
) {
  const user = await getCachedUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { ownerId: true }
    });

    if (!trip) return { error: 'Trip not found' };
    if (trip.ownerId !== user.id) return { error: 'Only the organizer can edit route coordinates' };

    await prisma.trip.update({
      where: { id: tripId },
      data: {
        startLat,
        startLng,
        endLat,
        endLng,
        routePath
      }
    });

    revalidatePath(`/trips/${tripId}`);
    revalidatePath(`/trips/${tripId}/map`);
    return { success: true };
  } catch (error: any) {
    console.error('Error saving trip coordinates:', error);
    return { error: 'Failed to update route coordinates' };
  }
}

// Add a custom marker (meeting point, rest stop, etc.) on the trip map
export async function addTripMarkerAction(
  tripId: string,
  title: string,
  description: string | null,
  lat: number,
  lng: number,
  type: string
) {
  const user = await getCachedUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    // Verify membership or ownership
    const isMemberOrOwner = await prisma.tripMember.findFirst({
      where: {
        tripId,
        userId: user.id
      }
    });

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { ownerId: true }
    });

    if (!trip) return { error: 'Trip not found' };
    if (trip.ownerId !== user.id && !isMemberOrOwner) {
      return { error: 'Only participants can add markers to this trip map' };
    }

    const marker = await prisma.tripMapMarker.create({
      data: {
        tripId,
        title,
        description,
        lat,
        lng,
        type,
        createdById: user.id
      }
    });

    revalidatePath(`/trips/${tripId}/map`);
    return { success: true, marker };
  } catch (error: any) {
    console.error('Error adding map marker:', error);
    return { error: 'Failed to add map marker' };
  }
}

// Delete a custom marker
export async function deleteTripMarkerAction(markerId: string) {
  const user = await getCachedUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const marker = await prisma.tripMapMarker.findUnique({
      where: { id: markerId },
      include: { trip: true }
    });

    if (!marker) return { error: 'Marker not found' };

    // Organizer or creator of marker can delete
    if (marker.createdById !== user.id && marker.trip.ownerId !== user.id) {
      return { error: 'Unauthorized' };
    }

    await prisma.tripMapMarker.delete({
      where: { id: markerId }
    });

    revalidatePath(`/trips/${marker.tripId}/map`);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting map marker:', error);
    return { error: 'Failed to delete map marker' };
  }
}

// Update a participant's shared location
export async function updateMemberLocationAction(
  tripId: string,
  lat: number | null,
  lng: number | null,
  shareLocation: boolean
) {
  const user = await getCachedUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const member = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId,
          userId: user.id
        }
      }
    });

    if (!member) return { error: 'You are not a member of this trip' };

    await prisma.tripMember.update({
      where: {
        tripId_userId: {
          tripId,
          userId: user.id
        }
      },
      data: {
        latitude: lat,
        longitude: lng,
        shareLocation,
        locationUpdatedAt: lat !== null ? new Date() : null
      }
    });

    revalidatePath(`/trips/${tripId}/map`);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating member location:', error);
    return { error: 'Failed to update shared location' };
  }
}
