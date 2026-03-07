'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SpinWheel from './SpinWheel';
import { useConversionStore } from '@/stores/conversionStore';

export default function SpinWheelController() {
  const [show, setShow] = useState(false);
  const { spinWheelShown, setSpinWheelShown } = useConversionStore();

  useEffect(() => {
    // Don't show if already shown this session or if email cookie exists
    if (spinWheelShown) return;
    if (document.cookie.includes('hyph_email=')) return;

    const timer = setTimeout(() => {
      setShow(true);
      setSpinWheelShown(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [spinWheelShown, setSpinWheelShown]);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && <SpinWheel onClose={handleClose} />}
    </AnimatePresence>
  );
}
