import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Mohon lengkapi nama, email, dan kata sandi.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.siplingUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.siplingUser.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'USER',
      },
    });

    return NextResponse.json(
      { message: 'Akun berhasil dibuat!', userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}
