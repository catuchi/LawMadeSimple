// DELETE /api/v1/bookmarks/[id] - Remove bookmark (auth required)

import { prisma } from '@/lib/db';
import { noContent, notFound, forbidden, withRateLimit, handleError } from '@/lib/api';
import { requireAuth } from '@/lib/api/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    // Require authentication
    const { userId } = await requireAuth();

    // Rate limiting
    const rateLimitCheck = await withRateLimit(request, 'bookmarks', userId);
    if (rateLimitCheck.error) {
      return rateLimitCheck.error;
    }

    const { id } = await params;

    // Find the bookmark
    const bookmark = await prisma.bookmark.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!bookmark) {
      return notFound('bookmark', { id });
    }

    // Verify ownership
    if (bookmark.userId !== userId) {
      return forbidden('You do not have permission to delete this bookmark');
    }

    // Delete the bookmark
    await prisma.bookmark.delete({
      where: { id },
    });

    return noContent();
  } catch (error) {
    return handleError(error, { endpoint: 'DELETE /api/v1/bookmarks/[id]' });
  }
}
