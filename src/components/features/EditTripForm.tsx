'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTripSchema, UpdateTripInput } from '@/lib/validation/trip';
import { updateTripAction } from '@/app/trips/actions';
import { Trip } from '@/types';
import { Loader2, X, Plus } from 'lucide-react';

interface EditTripFormProps {
  trip: Trip;
}

export default function EditTripForm({ trip }: EditTripFormProps) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Languages preferred tags state
  const [langInput, setLangInput] = useState('');
  const [languages, setLanguages] = useState<string[]>(trip.languages || []);

  const formattedStartDate = trip.startDate
    ? new Date(trip.startDate).toISOString().split('T')[0]
    : '';
  const formattedEndDate = trip.endDate
    ? new Date(trip.endDate).toISOString().split('T')[0]
    : '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateTripSchema),
    defaultValues: {
      title: trip.title,
      description: trip.description,
      type: trip.type,
      startLocation: trip.startLocation,
      endLocation: trip.endLocation,
      startDate: formattedStartDate as any,
      endDate: formattedEndDate as any,
      budgetRange: trip.budgetRange,
      maxCapacity: trip.maxCapacity,
      isVerifiedOnly: trip.isVerifiedOnly,
      genderPref: trip.genderPref,
      vehicle: trip.vehicle || '',
      difficulty: (trip.difficulty as any) || undefined,
      languages: trip.languages || [],
    },
  });

  const onSubmit = async (data: any) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    
    // Inject languages tags state
    data.languages = languages;

    const res = await updateTripAction(trip.id, data);
    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg('Trip details updated successfully!');
      router.push(`/trips/${trip.id}`);
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
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-500 font-medium">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="border border-border bg-card p-6 rounded-2xl shadow-sm space-y-6">
        
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Trip Title</label>
          <input
            type="text"
            {...register('title')}
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
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.startLocation && <p className="text-xs text-destructive">{errors.startLocation.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Destination Location</label>
            <input
              type="text"
              {...register('endLocation')}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.maxCapacity && <p className="text-xs text-destructive">{errors.maxCapacity.message}</p>}
          </div>

          {/* Vehicle */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Vehicle Preferred</label>
            <input
              type="text"
              {...register('vehicle')}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
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

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border border-border hover:bg-secondary py-3 rounded-xl font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-bold transition-all duration-200 shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
