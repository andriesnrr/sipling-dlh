import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BuatLaporanClient from './BuatLaporanClient';

export const dynamic = 'force-dynamic';

export default async function BuatLaporanPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/auth');
  }

  return (
    <>
      <Header />
      <BuatLaporanClient />
      <Footer />
    </>
  );
}
