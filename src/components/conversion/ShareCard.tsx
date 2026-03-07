'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Link2 } from 'lucide-react';

interface ShareCardProps {
  stemName: string;
  genre: string;
  bpm: number;
  stemKey: string;
  onClose: () => void;
}

export default function ShareCard({ stemName, genre, bpm, stemKey, onClose }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  const cardUrl = `/api/share-card?stem=${encodeURIComponent(stemName)}&genre=${encodeURIComponent(genre)}&bpm=${bpm}&key=${encodeURIComponent(stemKey)}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = cardUrl;
    link.download = `hyph-${stemName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.click();
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.origin + cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full max-w-sm bg-surface border border-border rounded-2xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/50 flex items-center justify-center text-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6">
            <h3 className="font-semibold mb-1 text-center">Share Your Purchase</h3>
            <p className="text-xs text-muted text-center mb-4">Show off what you just copped</p>

            {/* Preview card */}
            <div className="aspect-[9/16] max-h-64 mx-auto mb-4 rounded-lg overflow-hidden bg-[#0A0A0A] border border-border flex flex-col items-center justify-center p-6 text-center">
              <div className="text-emerald-400 text-xs font-mono mb-2">I JUST COPPED</div>
              <div className="text-white font-bold text-lg mb-2">{stemName}</div>
              <div className="flex items-center gap-2 text-xs text-white/60 mb-4">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  {genre}
                </span>
                <span>{bpm} BPM</span>
                <span>{stemKey}</span>
              </div>
              {/* Decorative waveform */}
              <div className="flex items-end gap-0.5 h-8">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-emerald-500/40"
                    style={{ height: `${20 + Math.sin(i * 0.5) * 60 + Math.random() * 20}%` }}
                  />
                ))}
              </div>
              <div className="mt-4 text-[10px] text-white/30">hyph.com</div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2.5 rounded-xl border border-border hover:border-foreground/20 text-sm font-medium flex items-center justify-center gap-2 transition-all"
              >
                <Link2 className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
