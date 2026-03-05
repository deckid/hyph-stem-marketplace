'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Download, ArrowRight, PartyPopper } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
      >
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <PartyPopper className="w-6 h-6 text-pink-400" />
          <h1 className="text-3xl font-bold">Purchase Complete!</h1>
          <PartyPopper className="w-6 h-6 text-pink-400" />
        </div>

        <p className="text-muted mb-8 max-w-md mx-auto">
          Your stems are ready to download. Time to make something incredible.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-surface border border-border mb-8"
        >
          <h2 className="font-semibold mb-4">Your Downloads</h2>
          <p className="text-sm text-muted mb-4">
            In a real implementation, download links would appear here. This is a demo.
          </p>
          <button className="px-6 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-medium flex items-center gap-2 mx-auto hover:bg-emerald-500/30 transition-colors">
            <Download className="w-4 h-4" />
            Download All (Demo)
          </button>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/browse"
            className="px-8 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-medium transition-all flex items-center gap-2"
          >
            Browse More <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="px-8 py-3 rounded-xl border border-border hover:border-pink-500/30 font-medium transition-all"
          >
            Back Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
