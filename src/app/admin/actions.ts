'use server';

import prisma from '@/lib/db';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

// Helper to verify if the active session belongs to an Administrator
async function verifyAdminAccess() {
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { error: 'Unauthorized. Please sign in.', isAdmin: false };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser || dbUser.role !== 'ADMIN') {
    return { error: 'Access Denied. Administrator credentials required.', isAdmin: false };
  }

  return { isAdmin: true, userId: user.id };
}

// Get system analytics, summaries, and breakdowns
export async function getAdminStatsAction() {
  const auth = await verifyAdminAccess();
  if (!auth.isAdmin) return { error: auth.error };

  try {
    const [
      totalUsers,
      totalTrips,
      pendingReportsCount,
      totalReviews,
      profileRatingStats,
      tripCategories,
      recentRegistrations,
    ] = await prisma.$transaction([
      // 1. Total active/suspended users count
      prisma.user.count({ where: { deletedAt: null } }),
      // 2. Total active/completed trips count
      prisma.trip.count({ where: { deletedAt: null } }),
      // 3. Pending safety reports count
      prisma.report.count({ where: { status: 'PENDING' } }),
      // 4. Total reviews count
      prisma.review.count(),
      // 5. Profile ratings summary
      prisma.profile.aggregate({
        _avg: {
          rating: true,
        },
      }),
      // 6. Category breakdown for charts
      prisma.trip.groupBy({
        by: ['type'],
        _count: {
          id: true,
        },
        where: { deletedAt: null },
        orderBy: {
          type: 'asc',
        },
      }),
      // 7. Recent registrations (last 5 users)
      prisma.user.findMany({
        where: { deletedAt: null },
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      }),
    ]);

    // Average trust score logic
    const avgRating = profileRatingStats._avg.rating || 0.0;
    const systemAverageTrustScore = Math.min(100, Math.round((avgRating * 12) + 30 + 10)); // simulated system average

    // Format chart metrics
    const tripTypeChartData = tripCategories.map((cat: any) => ({
      name: cat.type.replace('_', ' '),
      count: cat._count?.id || 0,
    }));

    return {
      success: true,
      stats: {
        totalUsers,
        totalTrips,
        pendingReportsCount,
        totalReviews,
        systemAverageRating: Math.round(avgRating * 10) / 10,
        systemAverageTrustScore,
      },
      tripTypeChartData,
      recentTravelers: JSON.parse(JSON.stringify(recentRegistrations)),
    };
  } catch (err: any) {
    console.error('Get admin stats error:', err);
    return { error: 'Failed to calculate system analytics.' };
  }
}

// List paginated travelers
export async function adminListUsersAction(page: number = 1, limit: number = 10, search: string = '') {
  const auth = await verifyAdminAccess();
  if (!auth.isAdmin) return { error: auth.error };

  try {
    const whereClause: any = {
      deletedAt: null,
    };

    if (search.trim()) {
      whereClause.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        {
          profile: {
            fullName: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    const [users, totalCount] = await prisma.$transaction([
      prisma.user.findMany({
        where: whereClause,
        include: {
          profile: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    return {
      success: true,
      users: JSON.parse(JSON.stringify(users)),
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  } catch (err: any) {
    console.error('Admin list users error:', err);
    return { error: 'Failed to retrieve traveler profiles.' };
  }
}

// List paginated trips (including deleted or cancelled ones for oversight)
export async function adminListTripsAction(page: number = 1, limit: number = 10, search: string = '') {
  const auth = await verifyAdminAccess();
  if (!auth.isAdmin) return { error: auth.error };

  try {
    const whereClause: any = {};

    if (search.trim()) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { startLocation: { contains: search, mode: 'insensitive' } },
        { endLocation: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [trips, totalCount] = await prisma.$transaction([
      prisma.trip.findMany({
        where: whereClause,
        include: {
          owner: {
            include: {
              profile: true,
            },
          },
          members: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.trip.count({ where: whereClause }),
    ]);

    return {
      success: true,
      trips: JSON.parse(JSON.stringify(trips)),
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  } catch (err: any) {
    console.error('Admin list trips error:', err);
    return { error: 'Failed to retrieve trip listings.' };
  }
}

// List safety reports
export async function adminListReportsAction(page: number = 1, limit: number = 10, status?: 'PENDING' | 'RESOLVED' | 'DISMISSED') {
  const auth = await verifyAdminAccess();
  if (!auth.isAdmin) return { error: auth.error };

  try {
    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    const [reports, totalCount] = await prisma.$transaction([
      prisma.report.findMany({
        where: whereClause,
        include: {
          reporter: {
            include: {
              profile: true,
            },
          },
          reportedUser: {
            include: {
              profile: true,
            },
          },
          reportedTrip: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.report.count({ where: whereClause }),
    ]);

    return {
      success: true,
      reports: JSON.parse(JSON.stringify(reports)),
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  } catch (err: any) {
    console.error('Admin list reports error:', err);
    return { error: 'Failed to retrieve safety reports.' };
  }
}

// Manage Traveler status: Suspend or Activate
export async function adminManageUserStatusAction(userId: string, newStatus: 'ACTIVE' | 'SUSPENDED') {
  const auth = await verifyAdminAccess();
  if (!auth.isAdmin) return { error: auth.error };

  if (auth.userId === userId) {
    return { error: 'You cannot suspend your own administrative account.' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: newStatus,
      },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('Admin manage user status error:', err);
    return { error: 'Failed to update user account status.' };
  }
}

// Force Remove Trip (soft delete or restore)
export async function adminRemoveTripAction(tripId: string, remove: boolean) {
  const auth = await verifyAdminAccess();
  if (!auth.isAdmin) return { error: auth.error };

  try {
    await prisma.trip.update({
      where: { id: tripId },
      data: {
        deletedAt: remove ? new Date() : null,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/trips');
    return { success: true };
  } catch (err: any) {
    console.error('Admin remove trip error:', err);
    return { error: 'Failed to remove or restore trip listing.' };
  }
}

// Resolve safety moderation report
export async function adminResolveReportAction(reportId: string, newStatus: 'RESOLVED' | 'DISMISSED') {
  const auth = await verifyAdminAccess();
  if (!auth.isAdmin) return { error: auth.error };

  try {
    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: newStatus,
      },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('Admin resolve report error:', err);
    return { error: 'Failed to resolve safety complaint.' };
  }
}
