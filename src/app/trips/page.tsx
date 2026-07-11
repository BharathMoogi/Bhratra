'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { listTripsAction } from './actions';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { MapPin, Calendar, Compass, Shield, Search, SlidersHorizontal, Loader2, ChevronLeft, ChevronRight, Users, Car, Star, ArrowUpDown } from 'lucide-react';
import { TripType, BudgetRange, Difficulty } from '@/types';

export default function TripsPage() {
  // Query Filters state
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState<BudgetRange | ''>('');
  const [date, setDate] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [language, setLanguage] = useState('');
  const [tripType, setTripType] = useState<TripType | ''>('');
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');
  const [seats, setSeats] = useState<number>(0);
  const [genderPref, setGenderPref] = useState<'ANY' | 'MALE_ONLY' | 'FEMALE_ONLY' | ''>('');
  const [sortBy, setSortBy] = useState<'LATEST' | 'HIGHEST_RATED' | 'NEAREST' | 'MOST_SEATS' | 'LOWEST_BUDGET'>('NEAREST');

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Data states
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchTrips = async (currentPage: number) => {
    setLoading(true);
    setErrorMsg(null);
    const res = await listTripsAction(
      {
        destination: destination || undefined,
        budget: (budget as BudgetRange) || undefined,
        date: date || undefined,
        vehicle: vehicle || undefined,
        language: language || undefined,
        tripType: (tripType as TripType) || undefined,
        difficulty: (difficulty as Difficulty) || undefined,
        seats: seats > 0 ? seats : undefined,
        genderPref: (genderPref as any) || undefined,
      },
      currentPage,
      6,
      sortBy
    );

    setLoading(false);
    if (res?.error) {
      setErrorMsg(res.error);
    } else if (res?.trips) {
      setTrips(res.trips);
      setTotalPages(res.totalPages || 1);
      setPage(res.currentPage || 1);
    }
  };

  // Trigger search on mount and when filters, sorting, or page change
  useEffect(() => {
    fetchTrips(page);
  }, [page, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page
    fetchTrips(1);
    setShowMobileFilters(false);
  };

  const handleResetFilters = () => {
    setDestination('');
    setBudget('');
    setDate('');
    setVehicle('');
    setLanguage('');
    setTripType('');
    setDifficulty('');
    setSeats(0);
    setGenderPref('');
    setSortBy('NEAREST');
    setPage(1);
    // Fetch immediately after resetting state
    setTimeout(() => fetchTrips(1), 0);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 w-full">
        
        {/* Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Explore Travel Groups</h1>
            <p className="text-muted-foreground mt-1">Discover active matching schedules looking for companions.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Sorting controls in header */}
            <div className="flex items-center gap-2 bg-card border border-border px-3.5 py-2 rounded-full text-xs font-semibold">
              <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setPage(1);
                }}
                className="bg-transparent border-none outline-none font-bold text-foreground cursor-pointer focus:ring-0"
              >
                <option value="NEAREST">Nearest Departure</option>
                <option value="LATEST">Latest Published</option>
                <option value="HIGHEST_RATED">Highest Rated Organizer</option>
                <option value="MOST_SEATS">Most Seats Available</option>
                <option value="LOWEST_BUDGET">Lowest Budget First</option>
              </select>
            </div>

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center justify-center gap-2 border border-border bg-card hover:bg-secondary px-4 py-2.5 rounded-full text-sm font-semibold transition-colors"
            >
              <SlidersHorizontal className="h-4.5 w-4.5" />
              Filters
            </button>
            <Link
              href="/trips/create"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-colors text-center"
            >
              Post a Trip
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          
          {/* 1. Sidebar Filters (Desktop View) */}
          <aside className="hidden lg:block space-y-6 bg-card border border-border p-6 rounded-2xl shadow-sm h-fit">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5 text-primary" /> Filters
              </h2>
              <button onClick={handleResetFilters} className="text-xs font-semibold text-primary hover:underline">
                Clear All
              </button>
            </div>
            
            <form onSubmit={handleSearchSubmit} className="space-y-5">
              {/* Destination */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Destination / Route</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Search city, start, end..."
                    className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
              </div>

              {/* Trip Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Trip Category</label>
                <select
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                >
                  <option value="">All Types</option>
                  <option value="ROAD_TRIP">Road Trip</option>
                  <option value="BIKE_RIDE">Bike Ride</option>
                  <option value="TREKKING">Trekking</option>
                  <option value="BACKPACKING">Backpacking</option>
                  <option value="WEEKEND">Weekend Trip</option>
                  <option value="INTERNATIONAL">International</option>
                </select>
              </div>

              {/* Budget */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Budget Range</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                >
                  <option value="">Any Budget</option>
                  <option value="BUDGET">Budget</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="LUXURY">Luxury</option>
                </select>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Depart After</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              {/* Vehicle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vehicle Preferred</label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder="e.g. SUV, Motorcycle"
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Adventure Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                >
                  <option value="">Any Level</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              {/* Gender Preference */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gender Preference</label>
                <select
                  value={genderPref}
                  onChange={(e) => setGenderPref(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                >
                  <option value="">Any Gender</option>
                  <option value="ANY">Mixed Gender Group</option>
                  <option value="MALE_ONLY">Male Only</option>
                  <option value="FEMALE_ONLY">Female Only</option>
                </select>
              </div>

              {/* Language */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Language Preference</label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="e.g. English, Hindi"
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              {/* Available Seats */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Min Available Seats</label>
                <input
                  type="number"
                  min="0"
                  value={seats || ''}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  placeholder="e.g. 2"
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-foreground hover:bg-foreground/90 text-background font-bold py-2.5 rounded-xl text-sm transition-colors shadow-sm"
              >
                Apply Filters
              </button>
            </form>
          </aside>

          {/* 2. Grid Lists & Cards */}
          <div className="lg:col-span-3 space-y-8">
            
            {loading ? (
              /* Loading Skeletons */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border border-border bg-card rounded-2xl p-6 h-60 animate-pulse space-y-4">
                    <div className="flex justify-between">
                      <div className="w-20 h-5 bg-secondary rounded" />
                      <div className="w-16 h-5 bg-secondary rounded" />
                    </div>
                    <div className="w-3/4 h-6 bg-secondary rounded" />
                    <div className="w-1/2 h-4 bg-secondary rounded" />
                    <div className="w-full h-8 bg-secondary rounded mt-8" />
                  </div>
                ))}
              </div>
            ) : errorMsg ? (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium text-center">
                {errorMsg}
              </div>
            ) : trips.length === 0 ? (
              <div className="border border-dashed border-border bg-card p-12 rounded-2xl text-center space-y-4">
                <Compass className="h-12 w-12 text-muted-foreground mx-auto stroke-[1.5]" />
                <h3 className="text-lg font-bold">No Matching Trips Found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Try widening your search filters or adjust your departure dates.
                </p>
                <button onClick={handleResetFilters} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2 rounded-full text-xs shadow-sm">
                  Reset Search Filters
                </button>
              </div>
            ) : (
              /* Dynamic Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trips.map((trip: any) => {
                  const approvedMembersCount = trip.members?.length || 1;
                  const seatsRemaining = Math.max(0, trip.maxCapacity - approvedMembersCount);

                  return (
                    <div
                      key={trip.id}
                      className="border border-border bg-card rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Badges Header */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                            {trip.type.replace('_', ' ')}
                          </span>
                          <span className={`text-xs font-bold ${seatsRemaining > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {seatsRemaining > 0 ? `${seatsRemaining} seats left` : 'Fully Booked'}
                          </span>
                        </div>

                        {/* Title & Route */}
                        <h3 className="font-bold text-lg mt-3.5 line-clamp-1 text-foreground hover:text-primary transition-colors">
                          <Link href={`/trips/${trip.id}`}>{trip.title}</Link>
                        </h3>
                        
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-2.5">
                          <MapPin className="h-4.5 w-4.5 text-primary" />
                          <span className="truncate">{trip.startLocation} to {trip.endLocation}</span>
                        </p>

                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1.5">
                          <Calendar className="h-4.5 w-4.5 text-muted-foreground" />
                          <span>
                            {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </p>

                        {/* Parameters details */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {trip.difficulty && (
                            <span className="inline-flex items-center text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-secondary border border-border text-foreground">
                              {trip.difficulty}
                            </span>
                          )}
                          {trip.vehicle && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-secondary border border-border text-foreground">
                              <Car className="h-3 w-3" /> {trip.vehicle}
                            </span>
                          )}
                          <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded bg-secondary border border-border text-foreground capitalize">
                            Budget: {trip.budgetRange.toLowerCase()}
                          </span>
                          <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded bg-secondary border border-border text-foreground capitalize">
                            Gender: {trip.genderPref.replace('_', ' ').toLowerCase()}
                          </span>
                        </div>
                      </div>

                      {/* Footer Card */}
                      <div className="border-t border-border mt-6 pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-secondary border border-border overflow-hidden flex items-center justify-center font-bold text-xs">
                            {trip.owner?.profile?.avatarUrl ? (
                              <img src={trip.owner.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              trip.owner?.profile?.fullName?.charAt(0) || trip.owner?.email.charAt(0)
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-0.5">
                              <span className="text-xs font-semibold truncate max-w-[100px]">
                                {trip.owner?.profile?.fullName || 'Traveler'}
                              </span>
                              {trip.owner?.profile?.isVerified && (
                                <Shield className="h-3.5 w-3.5 text-primary fill-primary/10" />
                              )}
                            </div>
                            {/* Organizer Rating display */}
                            {trip.owner?.profile?.rating > 0 && (
                              <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold">
                                <Star className="h-2.5 w-2.5 fill-current" />
                                <span>{trip.owner.profile.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Link
                          href={`/trips/${trip.id}`}
                          className="bg-secondary hover:bg-border text-foreground text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. Pagination Controls */}
            {totalPages > 1 && !loading && (
              <div className="flex items-center justify-center gap-4 pt-6 border-t border-border">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 border border-border bg-card rounded-full hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm font-semibold">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-border bg-card rounded-full hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 4. Mobile Drawer Filters overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="relative w-full max-w-sm bg-card border-l border-border h-full p-6 shadow-xl overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-border mb-6">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-sm font-semibold text-muted-foreground hover:text-foreground">
                Close
              </button>
            </div>
            
            <form onSubmit={handleSearchSubmit} className="space-y-5">
              {/* Mobile Destination */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Rishikesh"
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              {/* Mobile Trip Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Trip Category</label>
                <select
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">All Types</option>
                  <option value="ROAD_TRIP">Road Trip</option>
                  <option value="BIKE_RIDE">Bike Ride</option>
                  <option value="TREKKING">Trekking</option>
                  <option value="BACKPACKING">Backpacking</option>
                  <option value="WEEKEND">Weekend Trip</option>
                  <option value="INTERNATIONAL">International</option>
                </select>
              </div>

              {/* Mobile Budget */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Budget</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Any Budget</option>
                  <option value="BUDGET">Budget</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="LUXURY">Luxury</option>
                </select>
              </div>

              {/* Mobile Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Depart After</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              {/* Mobile Vehicle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vehicle Preferred</label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder="e.g. Car, SUV"
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              {/* Mobile Difficulty */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Adventure Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Any Level</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              {/* Mobile Gender preference */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gender Preference</label>
                <select
                  value={genderPref}
                  onChange={(e) => setGenderPref(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Any Gender</option>
                  <option value="ANY">Mixed Gender Group</option>
                  <option value="MALE_ONLY">Male Only</option>
                  <option value="FEMALE_ONLY">Female Only</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex-1 border border-border hover:bg-secondary py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-foreground hover:bg-foreground/90 text-background font-bold py-2.5 rounded-xl text-sm transition-colors shadow-sm"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
