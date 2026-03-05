import type { Stem, InstrumentType } from './types';
import { creators } from './creators';

// ── Seeded pseudo-random number generator (deterministic) ──────────────────
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Title pools per instrument ─────────────────────────────────────────────
const titlesByInstrument: Record<InstrumentType, string[]> = {
  drums: [
    'Pocket Groove', 'Boom Bap Kit', 'Trap Bounce', 'Dusty Break',
    'Crisp Snare Roll', 'Swing Time', 'Heavy Kick', 'Hat Cascade',
    'Jungle Breaks', 'Rim Shot Funk', 'Ghost Notes', 'Stadium Fill',
    'Four on the Floor', 'Breakbeat Chop', 'Lo-fi Shuffle',
  ],
  bass: [
    'Sub Drop', 'Funky Slap', 'Warm Analog', 'Rubber Bass',
    'Moog Walk', 'Deep Pulse', 'Acid Line', 'Fingerstyle Groove',
    'Plucked Sub', 'Octave Slide', '808 Rumble', 'Wobble Drive',
    'Reese Foundation', 'Round Bottom', 'Synth Bass Stab',
  ],
  guitar: [
    'Clean Arpeggios', 'Dirty Riff', 'Jazzy Chords', 'Nylon Fingerpick',
    'Wah Funk', 'Power Chords', 'Tremolo Swell', 'Slide Blues',
    'Chorus Strum', 'Flanger Lead', 'Acoustic Sunrise', 'Palm Mute Groove',
    'Harmonic Bloom', 'Distorted Drone', 'Reggae Skank',
  ],
  keys: [
    'Rhodes Warmth', 'Grand Piano Ballad', 'Wurlitzer Soul', 'Honky Tonk',
    'Tine Dreams', 'Broken Chord', 'Ivory Cascade', 'Minor Voicings',
    'Gospel Comping', 'Chromatic Run', 'Jazz Voicings', 'Staccato Pulse',
    'Octave Melody', 'Pedal Tone', 'Classical Etude',
  ],
  synth: [
    'Supersaw Riser', 'Analog Drift', 'Pluck Sequence', 'Retro Lead',
    'Detuned Stack', 'FM Bells', 'Arp Cascade', 'PWM Sweep',
    'Wavetable Morph', 'Unison Stab', 'Glitch Melody', 'Filter Dive',
    'Trance Gate', 'Bitcrushed Lead', 'Granular Texture',
  ],
  vocals: [
    'Soulful Hook', 'Whispered Verse', 'Harmony Stack', 'Falsetto Float',
    'Spoken Word', 'Belted Chorus', 'Vocal Chop', 'Breath & Space',
    'Call & Response', 'Topline Melody', 'Doo-Wop Layers', 'Ad-lib Fills',
    'Rap Verse', 'Choir Swell', 'Vocal Run',
  ],
  strings: [
    'Cinematic Swell', 'Pizzicato Bounce', 'Legato Passage', 'Tremolo Tension',
    'Chamber Quartet', 'Orchestral Hit', 'Solo Violin', 'Cello Drone',
    'Arco Sustain', 'Double Stop', 'Spiccato Rhythm', 'Glissando Rise',
    'Harmonic Flutter', 'Divisi Texture', 'Fiddle Reel',
  ],
  brass: [
    'Horn Section', 'Solo Trumpet', 'Trombone Slide', 'Muted Brass',
    'Big Band Stab', 'Fanfare', 'Flugelhorn Ballad', 'Sax Wail',
    'Brass Pad', 'Growl Tone', 'Jazz Lick', 'Mariachi Burst',
    'Funk Hits', 'Orchestral Blare', 'Tuba Foundation',
  ],
  woodwinds: [
    'Flute Trill', 'Clarinet Melody', 'Oboe Lament', 'Bassoon Groove',
    'Pan Flute Dream', 'Shakuhachi Breath', 'Recorder Dance', 'Piccolo Shine',
    'Alto Sax Smooth', 'Soprano Cry', 'Duduk Cry', 'Bansuri Flow',
    'Whistle Run', 'English Horn', 'Reed Buzz',
  ],
  percussion: [
    'Conga Pattern', 'Djembe Roll', 'Shaker Loop', 'Tambourine Pulse',
    'Bongo Groove', 'Cajon Stomp', 'Triangle Ting', 'Cowbell Drive',
    'Timbale Fill', 'Agogo Bell', 'Guiro Scrape', 'Claves Click',
    'Surdo Boom', 'Maracas Sway', 'Tabla Taal',
  ],
  fx: [
    'Riser Build', 'White Noise Sweep', 'Impact Hit', 'Reverse Crash',
    'Glitch Stutter', 'Tape Stop', 'Vinyl Crackle', 'Sub Drop FX',
    'Laser Zap', 'Radio Tuning', 'Bit Crush Wash', 'Doppler Shift',
    'Shimmer Trail', 'Circuit Bent', 'Atmosphere Bed',
  ],
  pad: [
    'Warm Blanket', 'Ice Crystal', 'Choir Wash', 'Evolving Texture',
    'Analog Cloud', 'Spectral Drift', 'Shimmer Pad', 'Dark Ambient',
    'Bright Horizon', 'Glass Resonance', 'Ocean Haze', 'Tape Saturated',
    'Granular Field', 'Quantum Float', 'Velvet Sustain',
  ],
};

const instrumentTypes: InstrumentType[] = [
  'drums', 'bass', 'guitar', 'keys', 'synth', 'vocals',
  'strings', 'brass', 'woodwinds', 'percussion', 'fx', 'pad',
];

const genres = [
  'Hip Hop', 'Electronic', 'Pop', 'R&B', 'Jazz', 'Lo-fi',
  'Ambient', 'Rock', 'Latin', 'Afrobeat', 'Classical', 'Trap',
  'House', 'Techno', 'Funk', 'Soul', 'Reggae', 'DnB',
];

const moods = [
  'Chill', 'Energetic', 'Dark', 'Dreamy', 'Aggressive',
  'Groovy', 'Ethereal', 'Melancholic', 'Uplifting', 'Hypnotic',
];

const musicalKeys = [
  'C Major', 'C Minor', 'C# Major', 'C# Minor',
  'D Major', 'D Minor', 'Eb Major', 'Eb Minor',
  'E Major', 'E Minor', 'F Major', 'F Minor',
  'F# Major', 'F# Minor', 'G Major', 'G Minor',
  'Ab Major', 'Ab Minor', 'A Major', 'A Minor',
  'Bb Major', 'Bb Minor', 'B Major', 'B Minor',
];

const tagPool = [
  'warm', 'crisp', 'punchy', 'smooth', 'gritty', 'lush', 'minimal',
  'layered', 'organic', 'synthetic', 'vintage', 'modern', 'airy',
  'heavy', 'bright', 'dark', 'distorted', 'clean', 'filtered',
  'reverbed', 'delayed', 'dry', 'saturated', 'compressed', 'wide',
  'mono', 'stereo', 'loopable', 'one-shot', 'melodic', 'rhythmic',
  'atmospheric', 'percussive', 'harmonic', 'textural', 'evolving',
  'static', 'sparse', 'dense', 'pitched', 'unpitched',
];

// ── Deterministic stem generator ───────────────────────────────────────────
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generateWaveform(rng: () => number): number[] {
  const data: number[] = [];
  for (let i = 0; i < 64; i++) {
    // Produce values between 0.1 and 1.0, rounded to 2 decimals
    const val = 0.1 + rng() * 0.9;
    data.push(Math.round(val * 100) / 100);
  }
  return data;
}

const audioFiles = [
  'backstreet-bass.m4a',
  'backstreet-drums.m4a',
  'backstreet-guitar.m4a',
  'backstreet-hats.m4a',
  'backstreet-keys.m4a',
  'backstreet-vox.m4a',
  'golden-hour-acoustic.m4a',
  'golden-hour-bass.m4a',
  'golden-hour-electric.m4a',
  'golden-hour-piano.m4a',
  'golden-hour-strings.m4a',
  'golden-hour-tamb.m4a',
  'golden-hour-vox.m4a',
  'night-drive-ambient.m4a',
  'night-drive-arp.m4a',
  'night-drive-drums.m4a',
  'night-drive-lead.m4a',
  'night-drive-pad.m4a',
  'night-drive-vox.m4a',
];

function generateStems(): Stem[] {
  const result: Stem[] = [];
  const totalStems = 312; // 26 per instrument * 12 instruments = 312
  const creatorIds = creators.map((c) => c.id);

  for (let i = 0; i < totalStems; i++) {
    const rng = mulberry32(i * 7919 + 42); // unique seed per stem

    // Distribute instruments evenly
    const instrument = instrumentTypes[i % instrumentTypes.length];
    const titles = titlesByInstrument[instrument];
    const titleIndex = Math.floor(i / instrumentTypes.length) % titles.length;
    const baseTitle = titles[titleIndex];

    // Add a variant suffix if we'd repeat a title for the same instrument
    const instrumentIndex = Math.floor(i / instrumentTypes.length);
    const variant = instrumentIndex >= titles.length
      ? ` ${String.fromCharCode(65 + (instrumentIndex % 26))}`
      : '';
    const title = `${baseTitle}${variant}`;

    const genre = genres[Math.floor(rng() * genres.length)];
    const mood = moods[Math.floor(rng() * moods.length)];
    const key = musicalKeys[Math.floor(rng() * musicalKeys.length)];
    const bpm = Math.floor(60 + rng() * 121); // 60-180
    const duration = Math.floor(15 + rng() * 166); // 15-180 seconds
    const downloads = Math.floor(rng() * 500);
    const creatorId = creatorIds[i % creatorIds.length];

    // Pick 3-5 tags deterministically
    const tagCount = 3 + Math.floor(rng() * 3);
    const tags: string[] = [];
    for (let t = 0; t < tagCount; t++) {
      const tag = tagPool[Math.floor(rng() * tagPool.length)];
      if (!tags.includes(tag)) tags.push(tag);
    }

    // Generate a date in 2024-2025 range
    const dayOffset = Math.floor(rng() * 730);
    const date = new Date(2024, 0, 1);
    date.setDate(date.getDate() + dayOffset);
    const createdAt = date.toISOString().split('T')[0];

    const id = `stem-${String(i + 1).padStart(4, '0')}`;
    const slug = toSlug(`${title}-${instrument}-${id}`);

    result.push({
      id,
      title,
      slug,
      creatorId,
      instrument,
      genre,
      mood,
      bpm,
      key,
      duration,
      price: 1.0,
      audioFile: audioFiles[i % audioFiles.length],
      waveformData: generateWaveform(rng),
      tags,
      downloads,
      createdAt,
    });
  }

  return result;
}

export const stems: Stem[] = generateStems();

export function getStemsByCreator(creatorId: string): Stem[] {
  return stems.filter((s) => s.creatorId === creatorId);
}

export function getStemBySlug(slug: string): Stem | undefined {
  return stems.find((s) => s.slug === slug);
}

export function getStemById(id: string): Stem | undefined {
  return stems.find((s) => s.id === id);
}
