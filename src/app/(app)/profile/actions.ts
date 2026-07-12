'use server';

import { getSupabaseServerClient } from '@/lib/supabase-server';
import prisma from '@/lib/db';
import { profileSchema, ProfileInput } from '@/lib/validation/profile';
import { revalidatePath } from 'next/cache';

// Update personal traveler profile fields
export async function updateProfileAction(formData: ProfileInput) {
  const result = profileSchema.safeParse(formData);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  try {
    await prisma.profile.update({
      where: { id: user.id },
      data: {
        fullName: result.data.fullName,
        bio: result.data.bio,
        phoneNumber: result.data.phoneNumber,
        gender: result.data.gender,
        birthDate: result.data.birthDate,
        interests: result.data.interests,
        languages: result.data.languages,
        dietary: result.data.dietary,
        smoking: result.data.smoking,
        bikeType: result.data.bikeType,
        ridingExperience: result.data.ridingExperience,
        travelStyle: result.data.travelStyle,
        budgetPref: result.data.budgetPref,
        preferredDestinations: result.data.preferredDestinations,
      },
    });

    revalidatePath('/profile');
    return { success: true };
  } catch (dbError: any) {
    console.error('Update profile db error:', dbError);
    return { error: 'Failed to update profile in database.' };
  }
}

// Upload avatar to Supabase Storage avatars bucket and update DB url reference
export async function uploadAvatarAction(formData: FormData) {
  const file = formData.get('avatar') as File;
  if (!file) {
    return { error: 'No image file provided.' };
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  try {
    const fileExtension = file.name.split('.').pop();
    const filePath = `${user.id}/avatar-${Date.now()}.${fileExtension}`;
    const fileBuffer = await file.arrayBuffer();

    // Stream upload directly to Supabase storage bucket 'avatars'
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError);
      return { error: `Storage Upload failed: ${uploadError.message}` };
    }

    // Retrieve public URL of the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Save the new avatarUrl reference in our local PostgreSQL database
    await prisma.profile.update({
      where: { id: user.id },
      data: {
        avatarUrl: publicUrl,
      },
    });

    revalidatePath('/profile');
    return { success: true, avatarUrl: publicUrl };
  } catch (err: any) {
    console.error('Avatar upload exception:', err);
    return { error: err.message || 'Failed to process avatar upload.' };
  }
}
