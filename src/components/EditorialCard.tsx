'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface EditorialItem {
  id: string;
  tag: string;
  headline: string;
  excerpt: string;
  href: string;
  variant: 'standard' | 'feature' | 'quote';
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
    variant: 'standard',
  },
  {
    id: 'ed-2',
    tag: 'SPOTLIGHT',
    headline: 'Meet the Producers Who Never Touch a DAW Menu',
    excerpt:
      'Hardware-first, no presets, no shortcuts. These creators record everything live — then chop it into stems for you.',
    href: '/about',
    variant: 'feature',
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
  },
  {
    id: 'ed-5',
    tag: 'BEHIND THE STEMS',
    headline: 'What Happens Before the Bounce',
    excerpt:
      'We asked five creators to walk us through their signal chain. Spoiler: none of them agree on anything.',
    href: '/about',
    variant: 'feature',
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
  },
  {
    id: 'ed-8',
    tag: 'CULTURE',
    headline: 'The Case for Imperfect Recordings',
    excerpt:
      'Tape hiss, room tone, finger noise — the sounds engineers remove are the ones that make music human.',
    href: '/about',
    variant: 'feature',
  },
];

export function getEditorialItems(): EditorialItem[] {
  return editorialContent;
}

export default function EditorialCard({
  item,
  index = 0,
}: {
  item: EditorialItem;
  index?: number;
}) {
  if (item.variant === 'quote' && item.quote) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="relative bg-foreground text-background rounded-lg border-[3px] border-foreground p-6 flex flex-col justify-center"
      >
        <span className="font-[family-name:var(--font-accent)] text-xs tracking-widest uppercase opacity-60 mb-3">
          {item.tag}
        </span>
        <blockquote className="font-[family-name:var(--font-display)] text-xl md:text-2xl leading-tight mb-3">
          &ldquo;{item.quote.text}&rdquo;
        </blockquote>
        <cite className="text-xs not-italic opacity-50">
          — {item.quote.attribution}
        </cite>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`group relative rounded-lg border-[3px] border-foreground p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#0A0A0A] ${
        item.variant === 'feature'
          ? 'bg-[#F5F0E8] halftone'
          : 'bg-surface'
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
