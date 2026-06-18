import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Akses khusus admin pemerintah.' },
        { status: 403 }
      );
    }

    // Await params to comply with Next.js 15+ App Router rules
    const { id } = await params;
    const { status } = await req.json();

    if (!status || !['Verifikasi', 'Proses', 'Selesai'].includes(status)) {
      return NextResponse.json(
        { error: 'Status tidak valid.' },
        { status: 400 }
      );
    }

    const updatedLaporan = await prisma.siplingLaporan.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      message: 'Status laporan berhasil diperbarui.',
      laporan: updatedLaporan,
    });
  } catch (error: any) {
    console.error('Laporan Patch Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal server.' },
      { status: 500 }
    );
  }
}
