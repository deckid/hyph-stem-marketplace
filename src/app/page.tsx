'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, DollarSign, Headphones, Users, Sparkles } from 'lucide-react';
import { stems } from '@/data/stems';
import { creators, getCreatorById } from '@/data/creators';
import StemCard from '@/components/StemCard';
import SearchBar from '@/components/SearchBar';

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-500/5 via-transparent to-transparent" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neutral-500/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100 border border-border text-foreground text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            300+ stems from 30 creators. The real deal.
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Stems for{' '}
            <span className="text-foreground font-bold">
              the cool cats
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-8">
            No label nonsense. Independent stems from real creators worldwide.
            Mix, match, and make music your way — starting at $0.33 per stem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="/browse"
              className="px-8 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-medium transition-all hover:shadow-[4px_4px_0_#0A0A0A] flex items-center gap-2"
            >
              Browse Stems <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 rounded-xl border border-border hover:border-neutral-600 text-foreground font-medium transition-all"
            >
              Learn More
            </Link>
          </div>

          <div className="max-w-md mx-auto">
            <SearchBar />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedStems() {
  const featured = stems.slice(0, 8);
  const creatorsMap: Record<string, (typeof creators)[number]> = {};
  featured.forEach((s) => {
    const c = getCreatorById(s.creatorId);
    if (c) creatorsMap[s.creatorId] = c;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Featured Stems</h2>
          <p className="text-muted mt-1">Hand-picked by our team</p>
        </div>
        <Link
          href="/browse"
          className="text-sm text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featured.map((stem, i) => (
          <StemCard key={stem.id} stem={stem} creator={creatorsMap[stem.creatorId]} index={i} />
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: <Headphones className="w-6 h-6" />,
      title: 'Browse & Preview',
      desc: 'Explore 300+ stems. Preview instantly with our in-browser player.',
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: 'Build Your Bundle',
      desc: 'Add stems to your cart. More stems = bigger discounts.',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Pay & Download',
      desc: 'Secure checkout. Instant download. Full commercial license.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">How It Works</h2>
        <p className="text-muted">Three steps to your next masterpiece</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="p-6 rounded-xl bg-surface border border-border text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-neutral-100 text-foreground flex items-center justify-center mx-auto mb-4">
              {step.icon}
            </div>
            <h3 className="font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-muted">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CreatorSpotlight() {
  const spotlightCreators = creators.filter((c) => c.verified).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Creator Spotlight</h2>
          <p className="text-muted mt-1">Meet the artists behind the stems</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {spotlightCreators.map((creator, i) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={`/creator/${creator.slug}`}
              className="block p-6 rounded-xl bg-surface border border-border hover:border-neutral-600 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-[#D4CFC5]/20 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-foreground group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-semibold mb-1">{creator.name}</h3>
              <p className="text-xs text-muted mb-2">{creator.location}</p>
              <p className="text-sm text-muted line-clamp-2">{creator.bio}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {creator.genres.slice(0, 2).map((g) => (
                  <span key={g} className="px-2 py-0.5 rounded-full bg-neutral-100 text-foreground text-[10px]">
                    {g}
                  </span>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { stems: '1', perStem: '$1.00/stem', discount: '', highlight: false },
    { stems: '3+', perStem: '$0.75/stem', discount: '25% off', highlight: false },
    { stems: '5+', perStem: '$0.60/stem', discount: '40% off', highlight: true },
    { stems: '10+', perStem: '$0.50/stem', discount: '50% off', highlight: false },
    { stems: '20+', perStem: '$0.33/stem', discount: '67% off', highlight: false },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Bundle Pricing</h2>
        <p className="text-muted">The more you grab, the more you save</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
        {tiers.map((tier) => (
          <div
            key={tier.stems}
            className={`p-4 rounded-xl border text-center ${
              tier.highlight
                ? 'bg-neutral-100 border-neutral-600 ring-1 ring-neutral-400/20'
                : 'bg-surface border-border'
            }`}
          >
            <div className="text-2xl font-bold mb-1">{tier.stems}</div>
            <div className="text-xs text-muted mb-2">stems</div>
            <div className="text-lg font-semibold text-foreground">{tier.perStem}</div>
            {tier.discount && <div className="text-xs text-emerald-400 mt-1">{tier.discount}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedStems />
      <HowItWorks />
      <CreatorSpotlight />
      <Pricing />
    </>
  );
}
