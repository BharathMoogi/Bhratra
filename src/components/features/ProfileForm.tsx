'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileInput } from '@/lib/validation/profile';
import { updateProfileAction, uploadAvatarAction } from '@/app/profile/actions';
import { UserProfile } from '@/types';
import { User, Phone, AlignLeft, Info, HelpCircle, Loader2, Check, ShieldCheck, Camera } from 'lucide-react';

interface ProfileFormProps {
  initialProfile: UserProfile;
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Image states
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialProfile.avatarUrl);
  const [isUploading, setIsUploading] = useState(false);

  // Interest/Language tag management
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState<string[]>(initialProfile.interests || []);
  
  const [languageInput, setLanguageInput] = useState('');
  const [languages, setLanguages] = useState<string[]>(initialProfile.languages || []);

  const formattedBirthDate = initialProfile.birthDate 
    ? new Date(initialProfile.birthDate).toISOString().split('T')[0] 
    : '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initialProfile.fullName || '',
      bio: initialProfile.bio || '',
      phoneNumber: initialProfile.phoneNumber || '',
      gender: (initialProfile.gender as any) || 'PREFER_NOT_TO_SAY',
      birthDate: formattedBirthDate ? formattedBirthDate as any : undefined,
      dietary: (initialProfile.dietary as any) || 'NO_PREFERENCE',
      smoking: initialProfile.smoking || false,
      interests: initialProfile.interests || [],
      languages: initialProfile.languages || [],
    },
  });

  const onSubmit = async (data: ProfileInput) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    
    // Inject local tags state
    data.interests = interests;
    data.languages = languages;

    const res = await updateProfileAction(data);
    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg('Your traveler profile was successfully updated!');
      router.refresh();
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('avatar', file);

    const res = await uploadAvatarAction(formData);
    setIsUploading(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else if (res?.avatarUrl) {
      setAvatarUrl(res.avatarUrl);
      setSuccessMsg('Avatar photo uploaded successfully.');
      router.refresh();
    }
  };

  // Tag helper controls
  const addInterest = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      e.preventDefault();
      if (!interests.includes(interestInput.trim()) && interests.length < 10) {
        const updated = [...interests, interestInput.trim()];
        setInterests(updated);
        setValue('interests', updated);
        setInterestInput('');
      }
    }
  };

  const removeInterest = (item: string) => {
    const updated = interests.filter((i) => i !== item);
    setInterests(updated);
    setValue('interests', updated);
  };

  const addLanguage = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && languageInput.trim()) {
      e.preventDefault();
      if (!languages.includes(languageInput.trim()) && languages.length < 5) {
        const updated = [...languages, languageInput.trim()];
        setLanguages(updated);
        setValue('languages', updated);
        setLanguageInput('');
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
      {/* Alert Banners */}
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

      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border border-border bg-card rounded-2xl shadow-sm">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-secondary border-2 border-border overflow-hidden flex items-center justify-center relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-muted-foreground" />
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-sm transition-all duration-200">
            <Camera className="h-4 w-4" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={isUploading}
            />
          </label>
        </div>
        
        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center gap-1.5 justify-center sm:justify-start">
            <h2 className="text-xl font-bold">{initialProfile.fullName || 'Traveler Profile'}</h2>
            {initialProfile.isVerified && (
              <ShieldCheck className="h-5 w-5 text-primary fill-primary/10" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{initialProfile.email}</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-foreground capitalize">
            Role: {initialProfile.role}
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="border border-border bg-card p-6 rounded-2xl shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Full Name</label>
            <input
              type="text"
              {...register('fullName')}
              placeholder="Your full name"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
            {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Phone Number</label>
            <input
              type="text"
              {...register('phoneNumber')}
              placeholder="+123456789"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
            {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Gender</label>
            <select
              {...register('gender')}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            >
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Birth Date */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Birth Date</label>
            <input
              type="date"
              {...register('birthDate', { valueAsDate: true })}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            />
            {errors.birthDate && <p className="text-xs text-destructive">{errors.birthDate.message}</p>}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">About Me (Bio)</label>
          <textarea
            rows={3}
            {...register('bio')}
            placeholder="Tell other travelers about yourself, your favorite destinations, your travel vibe..."
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
          {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
        </div>

        <hr className="border-border" />
        <h3 className="text-md font-bold">Travel Preferences</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Dietary */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Dietary Vibe</label>
            <select
              {...register('dietary')}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            >
              <option value="NO_PREFERENCE">No preference</option>
              <option value="VEG">Vegetarian</option>
              <option value="NON_VEG">Non-Vegetarian</option>
            </select>
          </div>

          {/* Smoking */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground block">Do you smoke?</label>
            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="smoking"
                {...register('smoking')}
                className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="smoking" className="text-sm font-semibold cursor-pointer select-none">
                Yes, I smoke during trips
              </label>
            </div>
          </div>
        </div>

        {/* Interests Tags */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Interests / Activities (Press Enter to Add)</label>
          <input
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyDown={addInterest}
            placeholder="e.g. Hiking, Backpacking, Photography, Camping"
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {interests.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-secondary border border-border px-3 py-1 rounded-full text-xs font-semibold text-foreground"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeInterest(item)}
                  className="text-muted-foreground hover:text-foreground font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Languages Tags */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Languages Spoken (Press Enter to Add)</label>
          <input
            type="text"
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            onKeyDown={addLanguage}
            placeholder="e.g. English, Spanish, French"
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {languages.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-secondary border border-border px-3 py-1 rounded-full text-xs font-semibold text-foreground"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-bold transition-all duration-200 shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              Saving Profile...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  );
}
