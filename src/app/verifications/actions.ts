'use server';

import { getSupabaseServerClient } from '@/lib/supabase-server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function submitVerificationAction(formData: FormData) {
  const file = formData.get('idDocument') as File;
  const docType = formData.get('docType') as string;

  if (!file) {
    return { error: 'Please upload an ID document file.' };
  }

  if (!docType) {
    return { error: 'Please select a document type.' };
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  try {
    const fileExtension = file.name.split('.').pop() || 'png';
    const filePath = `verifications/${user.id}/id-${Date.now()}.${fileExtension}`;
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
      return { error: `Verification document upload failed: ${uploadError.message}` };
    }

    // Retrieve public URL of the uploaded document
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Save verification details and immediately mark as verified for instant companion eligibility
    await prisma.profile.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationDoc: publicUrl,
      },
    });

    revalidatePath('/verifications');
    revalidatePath('/profile');
    return { success: true };
  } catch (err: any) {
    console.error('Verification submission exception:', err);
    return { error: err.message || 'Failed to submit verification.' };
  }
}
