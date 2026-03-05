'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface EditorialItem {
  id: string;
  tag: string;
  headline: string;
  excerpt: string;
  href: string;
  variant: 'standard' | 'feature' | 'quote';
  image?: string;
  quote?: { text: string; attribution: string };
}

const editorialContent: EditorialItem[] = [
  {
    id: 'ed-1',
    tag: 'THE CRAFT',
    headline: 'Why Lo-fi Drums Hit Different at 3AM',
    excerpt:
      'There\'s a reason dusty breaks sound better late at night. We talked to three producers about the psychology of imperfect rhythm.',
    href: '/browse?instrument=drums',
    variant: 'feature',
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&h=500&fit=crop',
  },
  {
    id: 'ed-2',
    tag: 'SPOTLIGHT',
    headline: 'Meet the Producers Who Never Touch a DAW Menu',
    excerpt:
      'Hardware-first, no presets, no shortcuts. These creators record everything live — then chop it into stems for you.',
    href: '/about',
    variant: 'feature',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=500&fit=crop',
  },
  {
    id: 'ed-3',
    tag: 'OPINION',
    headline: '',
    excerpt: '',
    href: '/about',
    variant: 'quote',
    quote: {
      text: 'A good stem is like a good conversation starter — it doesn\'t finish the sentence for you.',
      attribution: 'Kashkat editorial',
    },
  },
  {
    id: 'ed-4',
    tag: 'SOUND DESIGN',
    headline: 'The Bass That Built a Genre',
    excerpt:
      'From Moog to 808 to Reese — how a handful of bass patches became the foundation of modern electronic music.',
    href: '/browse?instrument=bass',
    variant: 'standard',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop',
  },
  {
    id: 'ed-5',
    tag: 'BEHIND THE STEMS',
    headline: 'What Happens Before the Bounce',
    excerpt:
      'We asked five creators to walk us through their signal chain. Spoiler: none of them agree on anything.',
    href: '/about',
    variant: 'feature',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=500&fit=crop',
  },
  {
    id: 'ed-6',
    tag: 'HOT TAKE',
    headline: '',
    excerpt: '',
    href: '/about',
    variant: 'quote',
    quote: {
      text: 'Stop scrolling sample packs. Start listening to stems. The difference is authorship.',
      attribution: 'Kashkat editorial',
    },
  },
  {
    id: 'ed-7',
    tag: 'TECHNIQUE',
    headline: 'Layering Vocals Without Losing the Soul',
    excerpt:
      'Stacking harmonies is easy. Making them breathe is hard. Here\'s how the cool cats do it.',
    href: '/browse?instrument=vocals',
    variant: 'standard',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop',
  },
  {
    id: 'ed-8',
    tag: 'CULTURE',
    headline: 'The Case for Imperfect Recordings',
    excerpt:
      'Tape hiss, room tone, finger noise — the sounds engineers remove are the ones that make music human.',
    href: '/about',
    variant: 'feature',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=500&fit=crop',
  },
];

export function getEditorialItems(): EditorialItem[] {
  return editorialContent;
}

export default function EditorialCard({
  item,
  index = 0,
  size = 'default',
}: {
  item: EditorialItem;
  index?: number;
  size?: 'default' | 'large';
}) {
  if (item.variant === 'quote' && item.quote) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="relative bg-foreground text-background rounded-lg border-[3px] border-foreground p-8 md:p-10 flex flex-col justify-center min-h-[240px]"
      >
        <span className="font-[family-name:var(--font-accent)] text-xs tracking-widest uppercase opacity-60 mb-4">
          {item.tag}
        </span>
        <blockquote className={`font-[family-name:var(--font-display)] leading-tight mb-4 ${
          size === 'large' ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
        }`}>
          &ldquo;{item.quote.text}&rdquo;
        </blockquote>
        <cite className="text-sm not-italic opacity-50">
          — {item.quote.attribution}
        </cite>
      </motion.div>
    );
  }

  // Cards with images
  if (item.image) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group relative rounded-lg border-[3px] border-foreground overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_#0A0A0A]"
      >
        <div className={`relative w-full overflow-hidden ${
          size === 'large' ? 'h-72 md:h-96' : 'h-48 md:h-56'
        }`}>
          <Image
            src={item.image}
            alt={item.headline}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={size === 'large' ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
            <span className="font-[family-name:var(--font-accent)] text-[10px] tracking-widest uppercase text-white/70 block mb-2 -rotate-1">
              {item.tag}
            </span>
            <h3 className={`font-[family-name:var(--font-display)] text-white leading-tight mb-2 ${
              size === 'large' ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
            }`}>
              {item.headline}
            </h3>
            {size === 'large' && (
              <p className="text-sm text-white/70 leading-relaxed line-clamp-2 mb-3">
                {item.excerpt}
              </p>
            )}
            <Link
              href={item.href}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-white group-hover:gap-2 transition-all"
            >
              Read more <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Fallback: text-only card
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`group relative rounded-lg border-[3px] border-foreground p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_#0A0A0A] min-h-[200px] ${
        item.variant === 'feature' ? 'bg-[#F5F0E8] halftone' : 'bg-surface'
      }`}
    >
      <div>
        <span className="font-[family-name:var(--font-accent)] text-[10px] tracking-widest uppercase text-muted block mb-2 -rotate-1">
          {item.tag}
        </span>
        <h3 className="font-[family-name:var(--font-display)] text-lg md:text-xl leading-tight mb-2">
          {item.headline}
        </h3>
        <p className="text-sm text-muted leading-relaxed line-clamp-3">
          {item.excerpt}
        </p>
      </div>
      <Link
        href={item.href}
        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide mt-4 group-hover:gap-2 transition-all"
      >
        Read more <ArrowRight className="w-3 h-3" />
      </Link>
    </motion.div>
  );
}
