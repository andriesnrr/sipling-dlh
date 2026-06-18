import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import { put } from '@vercel/blob';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Silakan masuk terlebih dahulu.' },
        { status: 401 }
      );
    }

    let userId = (session.user as any).id;

    if (!userId && session.user.email) {
      const dbUser = await prisma.siplingUser.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      if (dbUser) {
        userId = dbUser.id;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'ID Pengguna tidak ditemukan. Silakan masuk kembali.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const kategori = formData.get('kategori') as string;
    const lokasi = formData.get('lokasi') as string;
    const deskripsi = formData.get('deskripsi') as string;

    if (!kategori || !lokasi || !deskripsi) {
      return NextResponse.json(
        { error: 'Mohon lengkapi semua data laporan.' },
        { status: 400 }
      );
    }

    // Process file uploads (Hybrid: Vercel Blob in Prod, local public/uploads in Local Dev)
    const files = formData.getAll('files') as (File | string)[];
    const savedFileUrls: string[] = [];

    // Filter to only include valid File objects with size > 0
    const validFiles = files.filter(
      (file): file is File => 
        typeof file !== 'string' && 
        file !== null && 
        typeof file.arrayBuffer === 'function' && 
        file.size > 0
    );

    if (validFiles.length > 0) {
      const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

      if (hasBlobToken) {
        // Vercel Blob Upload
        for (const file of validFiles) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = file.name.split('.').pop();
          const filename = `sipling-${uniqueSuffix}.${fileExt}`;
          
          const blob = await put(filename, file, { access: 'public' });
          savedFileUrls.push(blob.url);
        }
      } else {
        // Local Disk Upload Fallback
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        for (const file of validFiles) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = file.name.split('.').pop();
          const filename = `sipling-${uniqueSuffix}.${fileExt}`;
          const filePath = join(uploadDir, filename);

          await writeFile(filePath, buffer);
          savedFileUrls.push(`/uploads/${filename}`);
        }
      }
    }

    // Create database entry
    const laporan = await prisma.siplingLaporan.create({
      data: {
        kategori,
        lokasi,
        deskripsi,
        foto: JSON.stringify(savedFileUrls),
        userId,
      },
    });

    return NextResponse.json(
      { message: 'Laporan berhasil dibuat!', laporanId: laporan.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Laporan Create Error:', error);
    return NextResponse.json(
      { error: `Terjadi kesalahan internal server: ${error.message || error}` },
      { status: 500 }
    );
  }
}
