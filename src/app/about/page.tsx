'use client';

import { motion } from 'framer-motion';
import { Heart, Globe, Users, Shield } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Made by Humans',
      description:
        'Every stem on KASHKAT is crafted by a real person with a real story. No AI-generated filler — just authentic creative expression from artists who pour their soul into every note.',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Community',
      description:
        'Our creators span 30+ countries and represent the full spectrum of musical tradition. From Afrobeat drummers in Lagos to electronic producers in Berlin.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Fair for Creators',
      description:
        'Creators keep 70% of every sale. No hidden fees, no complicated contracts. When you buy a stem, you directly support the artist who made it.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Clear Licensing',
      description:
        'Every purchase includes a full commercial license. Use stems in your releases, sync for film, or remix for live shows — no additional fees.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Music is{' '}
          <span className="text-foreground font-bold">
            human
          </span>
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          KASHKAT exists because we believe the best music is made when talented
          creators connect with passionate producers. Every stem tells a story.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {values.map((value, i) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-xl bg-surface border border-border"
          >
            <div className="w-12 h-12 rounded-xl bg-neutral-100 text-foreground flex items-center justify-center mb-4">
              {value.icon}
            </div>
            <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{value.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-8 rounded-2xl bg-[#D4CFC5]/20 border border-border text-center"
      >
        <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
        <p className="text-muted max-w-xl mx-auto leading-relaxed">
          We&apos;re building the most creator-friendly marketplace for audio stems.
          A place where independent musicians can reach global audiences, and
          producers can find authentic sounds that no sample pack can match.
          This is just the beginning.
        </p>
      </motion.div>
    </div>
  );
}
