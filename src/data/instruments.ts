import type { InstrumentConfig } from './types';

export const instruments: InstrumentConfig[] = [
  { type: 'drums', label: 'Drums', color: '#f97316', icon: 'drum' },
  { type: 'bass', label: 'Bass', color: '#3b82f6', icon: 'audio-waveform' },
  { type: 'guitar', label: 'Guitar', color: '#f59e0b', icon: 'guitar' },
  { type: 'keys', label: 'Keys', color: '#a855f7', icon: 'piano' },
  { type: 'synth', label: 'Synth', color: '#ec4899', icon: 'waves' },
  { type: 'vocals', label: 'Vocals', color: '#f43f5e', icon: 'mic' },
  { type: 'strings', label: 'Strings', color: '#10b981', icon: 'music' },
  { type: 'brass', label: 'Brass', color: '#eab308', icon: 'volume-2' },
  { type: 'woodwinds', label: 'Woodwinds', color: '#14b8a6', icon: 'wind' },
  { type: 'percussion', label: 'Percussion', color: '#ef4444', icon: 'circle-dot' },
  { type: 'fx', label: 'FX', color: '#8b5cf6', icon: 'sparkles' },
  { type: 'pad', label: 'Pad', color: '#06b6d4', icon: 'cloud' },
];

export function getInstrumentConfig(type: string): InstrumentConfig | undefined {
  return instruments.find((i) => i.type === type);
}
