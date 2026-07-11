'use client';

import React, { useState, useEffect } from 'react';
import {
  adminListUsersAction,
  adminListTripsAction,
  adminListReportsAction,
  adminManageUserStatusAction,
  adminRemoveTripAction,
  adminResolveReportAction,
} from '@/app/admin/actions';
import { Users, Compass, AlertTriangle, Star, CheckSquare, Search, ShieldAlert, ArrowRight, Loader2, Ban, RefreshCw, Eye } from 'lucide-react';

interface AdminDashboardProps {
  initialStats: {
    totalUsers: number;
    totalTrips: number;
    pendingReportsCount: number;
    totalReviews: number;
    systemAverageRating: number;
    systemAverageTrustScore: number;
  };
  initialTripTypeData: any[];
  recentTravelers: any[];
}

export default function AdminDashboard({
  initialStats,
  initialTripTypeData,
  recentTravelers,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'travelers' | 'trips' | 'reports'>('travelers');
  
  // Data lists states
  const [travelers, setTravelers] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  
  // Query states
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load active tab data on tab/page change or query submission
  const loadTabData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (activeTab === 'travelers') {
        const res = await adminListUsersAction(page, 8, searchQuery);
        if (res.error) setErrorMsg(res.error);
        else {
          setTravelers(res.users || []);
          setTotalPages(res.totalPages || 1);
        }
      } else if (activeTab === 'trips') {
        const res = await adminListTripsAction(page, 8, searchQuery);
        if (res.error) setErrorMsg(res.error);
        else {
          setTrips(res.trips || []);
          setTotalPages(res.totalPages || 1);
        }
      } else if (activeTab === 'reports') {
        const res = await adminListReportsAction(page, 8);
        if (res.error) setErrorMsg(res.error);
        else {
          setReports(res.reports || []);
          setTotalPages(res.totalPages || 1);
        }
      }
    } catch (err) {
      setErrorMsg('Failed to query dashboard database logs.');
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    setSearchQuery('');
  }, [activeTab]);

  useEffect(() => {
    loadTabData();
  }, [activeTab, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadTabData();
  };

  // 1. Suspend / Activate User account toggle
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    setActionLoadingId(userId);
    const nextStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    const res = await adminManageUserStatusAction(userId, nextStatus as any);
    setActionLoadingId(null);

    if (res.error) {
      alert(res.error);
    } else {
      setTravelers((prev) =>
        prev.map((t) => (t.id === userId ? { ...t, status: nextStatus } : t))
      );
    }
  };

  // 2. Remove / Restore Trip listing toggle
  const handleToggleTripStatus = async (tripId: string, isDeleted: boolean) => {
    setActionLoadingId(tripId);
    const res = await adminRemoveTripAction(tripId, !isDeleted);
    setActionLoadingId(null);

    if (res.error) {
      alert(res.error);
    } else {
      setTrips((prev) =>
        prev.map((t) =>
          t.id === tripId ? { ...t, deletedAt: isDeleted ? null : new Date().toISOString() } : t
        )
      );
    }
  };

  // 3. Resolve / Dismiss complaint reports
  const handleResolveReport = async (reportId: string, status: 'RESOLVED' | 'DISMISSED') => {
    setActionLoadingId(reportId);
    const res = await adminResolveReportAction(reportId, status);
    setActionLoadingId(null);

    if (res.error) {
      alert(res.error);
    } else {
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: status } : r))
      );
    }
  };

  // Find max category count to build relative CSS charts
  const maxTripCount = Math.max(...initialTripTypeData.map((d) => d.count), 1);

  return (
    <div className="space-y-8">
      
      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Users */}
        <div className="border border-border bg-card p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-primary/10 rounded-full text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Travelers</span>
            <p className="text-xl font-extrabold text-foreground">{initialStats.totalUsers}</p>
          </div>
        </div>

        {/* Trips */}
        <div className="border border-border bg-card p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-primary/10 rounded-full text-primary">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Trips Published</span>
            <p className="text-xl font-extrabold text-foreground">{initialStats.totalTrips}</p>
          </div>
        </div>

        {/* Reports */}
        <div className="border border-border bg-card p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-rose-500/10 rounded-full text-rose-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Open Reports</span>
            <p className="text-xl font-extrabold text-rose-500">{initialStats.pendingReportsCount}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="border border-border bg-card p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-amber-500/10 rounded-full text-amber-500">
            <Star className="h-6 w-6 fill-amber-500/10" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Average Rating</span>
            <p className="text-xl font-extrabold text-foreground">{initialStats.systemAverageRating.toFixed(1)} / 5.0</p>
          </div>
        </div>

      </div>

      {/* 2. Analytics Charts & Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trip category breakdown list chart */}
        <div className="lg:col-span-2 border border-border bg-card p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-md flex items-center gap-2">
            Trip Categories Distribution
          </h3>
          
          <div className="space-y-3.5">
            {initialTripTypeData.length === 0 ? (
              <p className="text-xs text-muted-foreground">No active trip statistics.</p>
            ) : (
              initialTripTypeData.map((item, idx) => {
                const percentage = Math.round((item.count / maxTripCount) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="capitalize">{item.name.toLowerCase()}</span>
                      <span>{item.count} trips</span>
                    </div>
                    {/* CSS Bar Chart */}
                    <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent registrants list */}
        <div className="border border-border bg-card p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-md">Recent Registrants</h3>
          
          <div className="divide-y divide-border">
            {recentTravelers.map((traveler) => (
              <div key={traveler.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden flex items-center justify-center font-bold text-xs flex-none border border-border">
                    {traveler.profile?.avatarUrl ? (
                      <img src={traveler.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      traveler.profile?.fullName?.charAt(0) || traveler.email.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold block truncate">
                      {traveler.profile?.fullName || 'Traveler'}
                    </span>
                    <span className="text-[10px] text-muted-foreground block truncate">
                      {traveler.email}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-semibold bg-secondary border border-border px-2 py-0.5 rounded text-muted-foreground">
                  {new Date(traveler.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Tabulated Administration Panel */}
      <div className="space-y-4">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-border gap-2">
          <button
            onClick={() => setActiveTab('travelers')}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition-all duration-200 ${
              activeTab === 'travelers'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Manage Travelers
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition-all duration-200 ${
              activeTab === 'trips'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Manage Trips
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition-all duration-200 relative ${
              activeTab === 'reports'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Safety Reports
            {initialStats.pendingReportsCount > 0 && (
              <span className="ml-1.5 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {initialStats.pendingReportsCount}
              </span>
            )}
          </button>
        </div>

        {/* Search controls (for users/trips tabs only) */}
        {activeTab !== 'reports' && (
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'travelers' ? 'Search travelers by name/email...' : 'Search trips by title/route...'}
                className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button type="submit" className="bg-secondary hover:bg-border text-foreground font-bold px-4 rounded-xl text-xs transition-colors">
              Search
            </button>
          </form>
        )}

        {/* Tab contents list */}
        {loading ? (
          <div className="flex items-center justify-center p-12 border border-border bg-card rounded-2xl">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : errorMsg ? (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium text-center">
            {errorMsg}
          </div>
        ) : (
          <div className="border border-border bg-card rounded-2xl shadow-sm overflow-hidden">
            
            {/* Tab 1: Travelers list */}
            {activeTab === 'travelers' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border text-muted-foreground font-bold">
                      <th className="p-4">Traveler</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Joined</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {travelers.map((t) => (
                      <tr key={t.id} className="hover:bg-secondary/15 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-secondary overflow-hidden flex items-center justify-center font-bold text-[10px]">
                              {t.profile?.avatarUrl ? (
                                <img src={t.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                t.profile?.fullName?.charAt(0) || t.email.charAt(0)
                              )}
                            </div>
                            <div>
                              <span className="font-semibold block">{t.profile?.fullName || 'Traveler'}</span>
                              <span className="text-[10px] text-muted-foreground block">{t.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-[10px]">{t.role}</td>
                        <td className="p-4 font-semibold">{t.profile?.rating?.toFixed(1) || '0.0'}</td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            t.status === 'SUSPENDED' 
                              ? 'bg-rose-500/10 text-rose-500' 
                              : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(t.id, t.status)}
                            disabled={actionLoadingId === t.id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                              t.status === 'SUSPENDED'
                                ? 'border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-500'
                                : 'border-rose-500/20 hover:bg-rose-500/10 text-rose-500'
                            }`}
                          >
                            {actionLoadingId === t.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : t.status === 'SUSPENDED' ? (
                              'Activate'
                            ) : (
                              'Suspend'
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 2: Trips list */}
            {activeTab === 'trips' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border text-muted-foreground font-bold">
                      <th className="p-4">Trip Title</th>
                      <th className="p-4">Organizer</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Departure</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {trips.map((trip) => {
                      const isDeleted = trip.deletedAt !== null;
                      return (
                        <tr key={trip.id} className="hover:bg-secondary/15 transition-colors">
                          <td className="p-4">
                            <span className="font-semibold block">{trip.title}</span>
                            <span className="text-[10px] text-muted-foreground block">{trip.startLocation} to {trip.endLocation}</span>
                          </td>
                          <td className="p-4">{trip.owner?.profile?.fullName || trip.owner?.email}</td>
                          <td className="p-4 font-semibold text-[10px] capitalize">{trip.type.toLowerCase().replace('_', ' ')}</td>
                          <td className="p-4 text-muted-foreground">
                            {new Date(trip.startDate).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              isDeleted 
                                ? 'bg-rose-500/10 text-rose-500' 
                                : 'bg-emerald-500/10 text-emerald-500'
                            }`}>
                              {isDeleted ? 'REMOVED' : 'ACTIVE'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleToggleTripStatus(trip.id, isDeleted)}
                              disabled={actionLoadingId === trip.id}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                                isDeleted
                                  ? 'border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-500'
                                  : 'border-rose-500/20 hover:bg-rose-500/10 text-rose-500'
                              }`}
                            >
                              {actionLoadingId === trip.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : isDeleted ? (
                                'Restore'
                              ) : (
                                'Remove'
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 3: Safety Reports list */}
            {activeTab === 'reports' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border text-muted-foreground font-bold">
                      <th className="p-4">Reporter</th>
                      <th className="p-4">Accused Target</th>
                      <th className="p-4">Reason Category</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {reports.map((report) => (
                      <tr key={report.id} className="hover:bg-secondary/15 transition-colors">
                        <td className="p-4">
                          <span className="font-semibold block">{report.reporter?.profile?.fullName || 'Traveler'}</span>
                          <span className="text-[10px] text-muted-foreground block">{report.reporter?.email}</span>
                        </td>
                        <td className="p-4">
                          {report.reportedUser ? (
                            <div>
                              <span className="font-semibold text-rose-500 block">User: {report.reportedUser.profile?.fullName || 'Traveler'}</span>
                              <span className="text-[10px] text-muted-foreground block">{report.reportedUser.email}</span>
                            </div>
                          ) : report.reportedTrip ? (
                            <div>
                              <span className="font-semibold text-rose-500 block">Trip: {report.reportedTrip.title}</span>
                            </div>
                          ) : (
                            'Unknown Target'
                          )}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold block">{report.category}</span>
                          <span className="text-[10px] text-muted-foreground block italic">"{report.reason}"</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            report.status === 'PENDING'
                              ? 'bg-amber-500/10 text-amber-500'
                              : report.status === 'RESOLVED'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {report.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleResolveReport(report.id, 'RESOLVED')}
                                disabled={actionLoadingId === report.id}
                                className="border border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full text-[9px] font-bold transition-colors"
                              >
                                Resolve
                              </button>
                              <button
                                onClick={() => handleResolveReport(report.id, 'DISMISSED')}
                                disabled={actionLoadingId === report.id}
                                className="border border-border hover:bg-secondary text-muted-foreground px-2.5 py-1 rounded-full text-[9px] font-bold transition-colors"
                              >
                                Dismiss
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-muted-foreground font-semibold">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty state list container */}
            {((activeTab === 'travelers' && travelers.length === 0) ||
              (activeTab === 'trips' && trips.length === 0) ||
              (activeTab === 'reports' && reports.length === 0)) && (
              <div className="p-8 text-center text-muted-foreground text-xs">
                No active records match the filter query.
              </div>
            )}

          </div>
        )}

        {/* Tab Pagination controls */}
        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1.5 border border-border bg-card rounded-full hover:bg-secondary disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-1.5 border border-border bg-card rounded-full hover:bg-secondary disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
}

// Small helper Chevron icons
function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
