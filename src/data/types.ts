export interface Creator {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  location: string;
  genres: string[];
  stemCount: number;
  verified: boolean;
}

export interface Stem {
  id: string;
  title: string;
  slug: string;
  creatorId: string;
  instrument: InstrumentType;
  genre: string;
  mood: string;
  bpm: number;
  key: string;
  duration: number;
  price: number;
  audioFile: string;
  waveformData: number[];
  tags: string[];
  downloads: number;
  createdAt: string;
}

export type InstrumentType =
  | 'drums' | 'bass' | 'guitar' | 'keys' | 'synth'
  | 'vocals' | 'strings' | 'brass' | 'woodwinds' | 'percussion'
  | 'fx' | 'pad';

export interface InstrumentConfig {
  type: InstrumentType;
  label: string;
  color: string;
  icon: string;
}
