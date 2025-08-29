'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@repo/db';
import { phoneNumberSchema } from '@repo/types';
import { logger } from 'better-auth';
import { headers } from 'next/headers';
import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: phoneNumberSchema
});

const ImportContactsSchema = z.object({
  groupName: z.string().min(1, 'Group name is required'),
  contacts: z.array(ContactSchema),
});

export async function importContacts(data: unknown) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return { error: 'Not authenticated', status: 401 };
  }
  const userId = session.user.id;

  const validationResult = ImportContactsSchema.safeParse(data);

  if (!validationResult.success) {
    return { error: `Error importing contacts! Check format`, details: validationResult.error.message, status: 400 };
  }

  const { groupName, contacts } = validationResult.data;

  if (contacts.length === 0) {
    return { error: 'CSV file must contain at least one contact.', status: 400 };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const newGroup = await tx.contactGroup.create({
        data: {
          name: groupName,
          userId: userId,
        },
      });

      await tx.contact.createMany({
        data: contacts.map((contact) => ({
          name: contact.name,
          phone: contact.phone,
          contactGroupId: newGroup.id,
          userId: userId,
        })),
      });
    });

    return { success: true, message: 'Contacts imported successfully.', status: 200 };
  } catch (error) {
    console.error('Error importing contacts:', error);
    return { error: 'An unexpected error occurred.', status: 500 };
  }
}
