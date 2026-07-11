'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tripSchema, TripInput } from '@/lib/validation/trip';
import { createTripAction } from '../actions';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Loader2, Plus, X } from 'lucide-react';

export default function CreateTripPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Languages preferred tag input state
  const [langInput, setLangInput] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'ROAD_TRIP' as const,
      startLocation: '',
      endLocation: '',
      startDate: new Date().toISOString().split('T')[0] as any,
      endDate: new Date().toISOString().split('T')[0] as any,
      budgetRange: 'MODERATE' as const,
      maxCapacity: 4,
      isVerifiedOnly: true,
      genderPref: 'ANY' as const,
      vehicle: '',
      difficulty: undefined,
      languages: [] as string[],
    },
  });

  const onSubmit = async (data: any) => {
    setErrorMsg(null);
    // Inject languages tags state
    data.languages = languages;

    const res = await createTripAction(data);
    if (res?.error) {
      setErrorMsg(res.error);
    } else if (res?.tripId) {
      router.push(`/trips/${res.tripId}`);
      router.refresh();
    }
  };

  const addLanguage = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && langInput.trim()) {
      e.preventDefault();
      if (!languages.includes(langInput.trim())) {
        const updated = [...languages, langInput.trim()];
        setLanguages(updated);
        setValue('languages', updated);
        setLangInput('');
      }
    }
  };

  const removeLanguage = (item: string) => {
    const updated = languages.filter((l) => l !== item);
    setLanguages(updated);
    setValue('languages', updated);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-10 pt-24 w-full">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create a New Trip</h1>
          <p className="text-muted-foreground">Define your route, budget, and find compatible travel companions.</p>
        </div>

        {errorMsg && (
          <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6 border border-border bg-card p-6 rounded-2xl shadow-sm">
          
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Trip Title</label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Weekend camping trip to Rishikesh"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Description & Itinerary</label>
            <textarea
              rows={4}
              {...register('description')}
              placeholder="Describe your plans, routes, stops, and who you want to travel with..."
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Trip Type</label>
              <select
                {...register('type')}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none"
              >
                <option value="ROAD_TRIP">Road Trip</option>
                <option value="BIKE_RIDE">Bike Ride</option>
                <option value="TREKKING">Trekking</option>
                <option value="BACKPACKING">Backpacking</option>
                <option value="WEEKEND">Weekend Trip</option>
                <option value="INTERNATIONAL">International</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Budget Range</label>
              <select
                {...register('budgetRange')}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none"
              >
                <option value="BUDGET">Budget (Low cost)</option>
                <option value="MODERATE">Moderate (Shared costs)</option>
                <option value="LUXURY">Luxury (High comfort)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Start Location</label>
              <input
                type="text"
                {...register('startLocation')}
                placeholder="e.g. Bangalore"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
              {errors.startLocation && <p className="text-xs text-destructive">{errors.startLocation.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Destination Location</label>
              <input
                type="text"
                {...register('endLocation')}
                placeholder="e.g. Coorg"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
              {errors.endLocation && <p className="text-xs text-destructive">{errors.endLocation.message}</p>}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Start Date</label>
              <input
                type="date"
                {...register('startDate')}
                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none"
              />
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">End Date</label>
              <input
                type="date"
                {...register('endDate')}
                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none"
              />
              {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Max Capacity */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Max Companions</label>
              <input
                type="number"
                {...register('maxCapacity', { valueAsNumber: true })}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
              {errors.maxCapacity && <p className="text-xs text-destructive">{errors.maxCapacity.message}</p>}
            </div>

            {/* Vehicle */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Vehicle Preferred</label>
              <input
                type="text"
                {...register('vehicle')}
                placeholder="e.g. Motorcycle, SUV"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
              {errors.vehicle && <p className="text-xs text-destructive">{errors.vehicle.message}</p>}
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Difficulty Level</label>
              <select
                {...register('difficulty')}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none"
              >
                <option value="">None / Easy</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          {/* Gender & Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Gender Preference</label>
              <select
                {...register('genderPref')}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none"
              >
                <option value="ANY">Any Gender</option>
                <option value="MALE_ONLY">Male Only</option>
                <option value="FEMALE_ONLY">Female Only</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Preferred Languages (Press Enter)</label>
              <input
                type="text"
                value={langInput}
                onChange={(e) => setLangInput(e.target.value)}
                onKeyDown={addLanguage}
                placeholder="e.g. English, Hindi"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {languages.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-secondary border border-border px-2 py-0.5 rounded-full text-xs font-semibold text-foreground"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeLanguage(item)}
                      className="text-muted-foreground hover:text-foreground font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Boolean checkboxes */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isVerifiedOnly"
              {...register('isVerifiedOnly')}
              className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="isVerifiedOnly" className="text-sm font-semibold select-none cursor-pointer">
              Only allow verified travelers (ID Verified Badge)
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-bold transition-all duration-200 shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Publishing...
              </>
            ) : (
              'Publish Trip Request'
            )}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
