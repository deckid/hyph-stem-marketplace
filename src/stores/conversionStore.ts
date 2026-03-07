import { create } from 'zustand';

interface ConversionState {
  spinWheelShown: boolean;
  activeCredit: { amountCents: number; expiresAt: Date } | null;
  streakDays: number;
  setSpinWheelShown: (v: boolean) => void;
  setActiveCredit: (credit: ConversionState['activeCredit']) => void;
  setStreakDays: (days: number) => void;
}

export const useConversionStore = create<ConversionState>((set) => ({
  spinWheelShown: false,
  activeCredit: null,
  streakDays: 0,
  setSpinWheelShown: (v) => set({ spinWheelShown: v }),
  setActiveCredit: (credit) => set({ activeCredit: credit }),
  setStreakDays: (days) => set({ streakDays: days }),
}));
