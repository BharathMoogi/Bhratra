import { z } from 'zod';

// Define the base object schema first (without refinements) so .partial() can be used
export const tripBaseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long').max(100, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters long').max(1000, 'Description is too long'),
  type: z.enum(['ROAD_TRIP', 'BIKE_RIDE', 'TREKKING', 'BACKPACKING', 'WEEKEND', 'INTERNATIONAL'], {
    message: 'Please select a valid trip type',
  }),
  startLocation: z.string().min(2, 'Start location is required'),
  endLocation: z.string().min(2, 'End location is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  budgetRange: z.enum(['BUDGET', 'MODERATE', 'LUXURY'], {
    message: 'Please select a valid budget range',
  }),
  maxCapacity: z.number().int().min(1, 'Trip capacity must be at least 1').max(50, 'Max capacity is 50 companions'),
  isVerifiedOnly: z.boolean().default(true),
  genderPref: z.enum(['ANY', 'MALE_ONLY', 'FEMALE_ONLY']).default('ANY'),
  vehicle: z.string().max(50, 'Vehicle name too long').optional().nullable().or(z.literal('')),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional().nullable(),
  languages: z.array(z.string()).default([]),
});

// Create the validated creation schema by adding date refinements
export const tripSchema = tripBaseSchema
  .refine((data) => data.startDate >= new Date(new Date().setHours(0,0,0,0)), {
    message: 'Start date cannot be in the past',
    path: ['startDate'],
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be on or after the start date',
    path: ['endDate'],
  });

// Safely generate the partial schema from the base schema for update forms
export const updateTripSchema = tripBaseSchema.partial();

export type TripInput = z.infer<typeof tripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
