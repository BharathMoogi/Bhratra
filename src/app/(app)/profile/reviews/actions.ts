'use server';

import prisma from '@/lib/db';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

// Submit feedback review for a traveler after a trip ends
export async function submitReviewAction(
  revieweeId: string,
  tripId: string,
  categoryRatings: {
    SAFETY: number;
    COMMUNICATION: number;
    DRIVING: number;
    FRIENDLINESS: number;
    PUNCTUALITY: number;
    OVERALL_EXPERIENCE: number;
  },
  comment?: string | null
) {
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  const reviewerId = user.id;

  if (reviewerId === revieweeId) {
    return { error: 'You cannot submit feedback for yourself.' };
  }

  try {
    // 1. Enforce access control - Reviewer and Reviewee must be accepted companions in the same trip
    const trip = await prisma.trip.findUnique({
      where: { id: tripId, deletedAt: null },
      include: {
        members: true,
      },
    });

    if (!trip) {
      return { error: 'Trip not found.' };
    }

    // Trip must have ended or status marked as completed
    const isCompleted = trip.status === 'COMPLETED' || new Date(trip.endDate) < new Date();
    if (!isCompleted) {
      return { error: 'Reviews are only enabled after the trip has concluded.' };
    }

    const reviewerJoined = trip.members.some((m) => m.userId === reviewerId);
    const revieweeJoined = trip.members.some((m) => m.userId === revieweeId);

    if (!reviewerJoined || !revieweeJoined) {
      return { error: 'You can only review companions you actually traveled with.' };
    }

    // 2. Prevent duplicate review submissions
    const existingReview = await prisma.review.findUnique({
      where: {
        reviewerId_revieweeId_tripId: {
          reviewerId,
          revieweeId,
          tripId,
        },
      },
    });

    if (existingReview) {
      return { error: 'You have already submitted feedback for this user on this trip.' };
    }

    // Calculate Overall Average rating value (1-5 stars)
    const scores = Object.values(categoryRatings);
    const sumScores = scores.reduce((sum, s) => sum + s, 0);
    const averageScore = Math.round((sumScores / scores.length) * 10) / 10; // Rounded to 1 decimal place

    // 3. Write feedback and update cached ratings inside a secure database transaction
    await prisma.$transaction(async (tx) => {
      // Create Review
      const createdReview = await tx.review.create({
        data: {
          tripId,
          reviewerId,
          revieweeId,
          ratingValue: Math.round(averageScore), // Integer rating representation
          comment: comment || null,
        },
      });

      // Create detailed Category Ratings
      const ratingsData = Object.entries(categoryRatings).map(([category, score]) => ({
        reviewId: createdReview.id,
        category,
        score,
      }));

      await tx.rating.createMany({
        data: ratingsData,
      });

      // Fetch all reviews for the reviewee to recalculate global Profile rating average
      const allReviews = await tx.review.findMany({
        where: { revieweeId },
        select: { ratingValue: true },
      });

      const totalRatingSum = allReviews.reduce((sum, r) => sum + r.ratingValue, 0);
      const newGlobalAverage = totalRatingSum / allReviews.length;

      // Update Profile cache rating
      await tx.profile.update({
        where: { id: revieweeId },
        data: {
          rating: Math.round(newGlobalAverage * 10) / 10,
        },
      });
    });

    revalidatePath(`/profile/${revieweeId}`);
    return { success: true };
  } catch (err: any) {
    console.error('Submit review error:', err);
    return { error: 'Failed to submit feedback review.' };
  }
}

// Compute traveler completed trips, ratings, trust scores, and reviews
export async function getTravelerTrustProfileAction(travelerId: string) {
  try {
    const userWithProfile = await prisma.user.findUnique({
      where: { id: travelerId, deletedAt: null },
      include: {
        profile: true,
      },
    });

    if (!userWithProfile || !userWithProfile.profile) {
      return { error: 'Traveler not found.' };
    }

    const profile = userWithProfile.profile;

    // Calculate completed trips count (where member role was active and date is past)
    const completedTripsCount = await prisma.tripMember.count({
      where: {
        userId: travelerId,
        deletedAt: null,
        trip: {
          deletedAt: null,
          OR: [
            { status: 'COMPLETED' },
            { endDate: { lte: new Date() } },
          ],
        },
      },
    });

    // Fetch reviews received
    const reviews = await prisma.review.findMany({
      where: {
        revieweeId: travelerId,
      },
      include: {
        reviewer: {
          include: {
            profile: true,
          },
        },
        ratings: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate Trust Score dial
    const avgRating = profile.rating || 0.0;
    const isVerified = profile.isVerified;
    const computedScore = Math.round(
      (avgRating * 12) + (isVerified ? 30 : 0) + (completedTripsCount * 2)
    );
    const trustScore = Math.min(100, Math.max(0, computedScore));

    return {
      success: true,
      profile: JSON.parse(JSON.stringify(profile)),
      email: userWithProfile.email,
      completedTripsCount,
      avgRating,
      trustScore,
      reviews: JSON.parse(JSON.stringify(reviews)),
    };
  } catch (err: any) {
    console.error('Get trust profile error:', err);
    return { error: 'Failed to retrieve traveler trust profiles.' };
  }
}
