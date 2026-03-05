'use client';

import Navbar from './Navbar';
import Footer from './Footer';
import GlobalPlayer from './GlobalPlayer';
import CartDrawer from './CartDrawer';
import PasswordGate from './PasswordGate';
import { usePlayerStore } from '@/stores/playerStore';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const currentStem = usePlayerStore((s) => s.currentStem);

  return (
    <PasswordGate>
      <Navbar />
      <main className={`pt-20 ${currentStem ? 'pb-20' : ''}`}>{children}</main>
      <Footer />
      <GlobalPlayer />
      <CartDrawer />
    </PasswordGate>
  );
}
