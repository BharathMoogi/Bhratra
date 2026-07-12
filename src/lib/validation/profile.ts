import { z } from 'zod';

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters long').optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional().or(z.literal('')),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  birthDate: z.coerce.date().max(new Date(), 'Birth date cannot be in the future').optional(),
  interests: z.array(z.string()).max(10, 'You can choose up to 10 interests').default([]),
  languages: z.array(z.string()).max(5, 'You can choose up to 5 languages').default([]),
  dietary: z.enum(['VEG', 'NON_VEG', 'NO_PREFERENCE']).default('NO_PREFERENCE'),
  smoking: z.boolean().default(false),
  bikeType: z.string().optional().nullable(),
  ridingExperience: z.string().optional().nullable(),
  travelStyle: z.string().optional().nullable(),
  budgetPref: z.string().optional().nullable(),
  preferredDestinations: z.array(z.string()).max(10, 'You can choose up to 10 destinations').default([]),
});

export const verificationSchema = z.object({
  verificationDocUrl: z.string().url('Invalid documentation file link'),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type VerificationInput = z.infer<typeof verificationSchema>;
