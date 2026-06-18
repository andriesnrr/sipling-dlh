'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateProfile(phone: string) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const userId = (session.user as any).id;

  await prisma.siplingUser.update({
    where: { id: userId },
    data: { phone }
  });

  revalidatePath('/profil');
  return { success: true };
}
