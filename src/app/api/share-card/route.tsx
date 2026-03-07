import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const stem = searchParams.get('stem') || 'Untitled';
  const genre = searchParams.get('genre') || 'Unknown';
  const bpm = searchParams.get('bpm') || '120';
  const key = searchParams.get('key') || 'C';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1920px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0A0A',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            width: '60px',
            height: '4px',
            backgroundColor: '#00FF87',
            borderRadius: '2px',
            marginBottom: '40px',
          }}
        />

        {/* Label */}
        <div
          style={{
            fontSize: '28px',
            color: '#00FF87',
            letterSpacing: '8px',
            marginBottom: '40px',
            fontWeight: 600,
          }}
        >
          I JUST COPPED
        </div>

        {/* Stem name */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            marginBottom: '30px',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          {stem}
        </div>

        {/* Tags */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '60px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              backgroundColor: 'rgba(0, 255, 135, 0.15)',
              color: '#00FF87',
              fontSize: '24px',
            }}
          >
            {genre}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '24px' }}>{bpm} BPM</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '24px' }}>{key}</div>
        </div>

        {/* Decorative waveform */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '80px' }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: `${20 + Math.sin(i * 0.4) * 50 + (i % 3) * 10}px`,
                borderRadius: '4px',
                backgroundColor: 'rgba(0, 255, 135, 0.3)',
              }}
            />
          ))}
        </div>

        {/* Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            fontSize: '20px',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '4px',
          }}
        >
          hyph.com
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
    }
  );
}
