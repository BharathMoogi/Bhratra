'use server';

import prisma from '@/lib/db';
import { getSupabaseServerClient } from '@/lib/supabase-server';

// Send a chat message
export async function sendChatMessageAction(
  tripId: string,
  content: string,
  fileUrl?: string | null,
  fileType?: string | null
) {
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  try {
    // 1. Enforce access control - User must be an approved member of this trip group
    const isMember = await prisma.tripMember.findFirst({
      where: {
        tripId,
        userId: user.id,
        deletedAt: null,
      },
    });

    if (!isMember) {
      return { error: 'Access Denied. Only accepted group members can chat.' };
    }

    if (!content.trim() && !fileUrl) {
      return { error: 'Message cannot be empty.' };
    }

    // 2. Insert Message into database
    const message = await prisma.message.create({
      data: {
        tripId,
        senderId: user.id,
        content: content.trim(),
        fileUrl: fileUrl || null,
        fileType: fileType || null,
      },
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
      },
    });

    // 3. Keep read state synchronized
    await prisma.chatReadState.upsert({
      where: {
        tripId_userId: {
          tripId,
          userId: user.id,
        },
      },
      update: { lastReadAt: new Date() },
      create: {
        tripId,
        userId: user.id,
        lastReadAt: new Date(),
      },
    });

    return { success: true, message: JSON.parse(JSON.stringify(message)) };
  } catch (err: any) {
    console.error('Send message error:', err);
    return { error: 'Failed to send message.' };
  }
}

// Upload file/image attachment to Supabase Storage chat-attachments bucket
export async function uploadChatAttachmentAction(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No attachment file provided.' };
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  try {
    const fileExtension = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const fileBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from('chat-attachments')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage Upload error:', uploadError);
      return { error: `Upload failed: ${uploadError.message}` };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('chat-attachments')
      .getPublicUrl(filePath);

    const isImage = file.type.startsWith('image/');
    const fileType = isImage ? 'IMAGE' : 'DOCUMENT';

    return { success: true, fileUrl: publicUrl, fileType, fileName: file.name };
  } catch (err: any) {
    console.error('Attachment upload exception:', err);
    return { error: 'Failed to process attachment upload.' };
  }
}

// Update the user's last read timestamp for the trip chat
export async function updateLastReadAction(tripId: string) {
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  try {
    await prisma.chatReadState.upsert({
      where: {
        tripId_userId: {
          tripId,
          userId: user.id,
        },
      },
      update: { lastReadAt: new Date() },
      create: {
        tripId,
        userId: user.id,
        lastReadAt: new Date(),
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error('Update read state error:', err);
    return { error: 'Failed to update read status.' };
  }
}

// Get the initial messages, member profiles, and user details
export async function getTripChatContextAction(tripId: string) {
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  try {
    const isMember = await prisma.tripMember.findFirst({
      where: {
        tripId,
        userId: user.id,
        deletedAt: null,
      },
      include: {
        trip: {
          select: {
            title: true,
            ownerId: true,
          },
        },
      },
    });

    if (!isMember) {
      return { error: 'Access Denied. Only accepted group members can view this chat.' };
    }

    // Fetch last 50 messages
    const messages = await prisma.message.findMany({
      where: {
        tripId,
        deletedAt: null,
      },
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 50,
    });

    // Fetch read states for all users in the trip to draw receipts
    const readStates = await prisma.chatReadState.findMany({
      where: {
        tripId,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return {
      success: true,
      currentUser: user,
      tripTitle: isMember.trip.title,
      messages: JSON.parse(JSON.stringify(messages)),
      readStates: JSON.parse(JSON.stringify(readStates)),
    };
  } catch (err: any) {
    console.error('Get chat context error:', err);
    return { error: 'Failed to retrieve chat room details.' };
  }
}
