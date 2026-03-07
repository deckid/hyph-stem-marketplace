'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Plus, Lock } from 'lucide-react';
import { stems } from '@/data/stems';

export default function AdminFlashPacksPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [title, setTitle] = useState('');
  const [selectedStems, setSelectedStems] = useState<string[]>([]);
  const [originalPrice, setOriginalPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [expiresHours, setExpiresHours] = useState('24');
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAuth = () => {
    // Password is checked server-side, but we gate the UI too
    if (password.length > 0) {
      setAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Enter the admin password');
    }
  };

  const toggleStem = (stemId: string) => {
    setSelectedStems((prev) =>
      prev.includes(stemId) ? prev.filter((id) => id !== stemId) : [...prev, stemId]
    );
  };

  const handleCreate = async () => {
    if (!title || selectedStems.length === 0 || !originalPrice || !salePrice) {
      setResult('Fill in all fields');
      return;
    }

    setCreating(true);
    setResult(null);

    try {
      const res = await fetch('/api/flash-packs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          stem_ids: selectedStems,
          original_price_cents: Math.round(parseFloat(originalPrice) * 100),
          sale_price_cents: Math.round(parseFloat(salePrice) * 100),
          expires_hours: parseInt(expiresHours),
          admin_password: password,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setResult(`Error: ${data.error}`);
      } else {
        setResult(`Flash pack created! ID: ${data.pack?.id}`);
        setTitle('');
        setSelectedStems([]);
        setOriginalPrice('');
        setSalePrice('');
      }
    } catch {
      setResult('Failed to create flash pack');
    }

    setCreating(false);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <Lock className="w-8 h-8 text-muted mx-auto mb-2" />
            <h1 className="text-xl font-bold">Admin Access</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            placeholder="Admin password"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm mb-3 focus:outline-none focus:border-accent/50"
          />
          {authError && <p className="text-xs text-red-400 mb-2">{authError}</p>}
          <button
            onClick={handleAuth}
            className="w-full py-3 rounded-xl bg-accent text-white font-medium text-sm"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-accent" />
          <h1 className="text-2xl font-bold">Create Flash Pack</h1>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 mb-6">
          <div>
            <label className="text-xs text-muted mb-1 block">Pack Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midnight Drums Bundle"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-accent/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted mb-1 block">Original Price ($)</label>
              <input
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="9.99"
                type="number"
                step="0.01"
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-accent/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Sale Price ($)</label>
              <input
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="2.99"
                type="number"
                step="0.01"
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-accent/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted mb-1 block">Expires In (hours)</label>
            <input
              value={expiresHours}
              onChange={(e) => setExpiresHours(e.target.value)}
              type="number"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-accent/50"
            />
          </div>
        </div>

        {/* Stem selector */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-3">
            Select Stems ({selectedStems.length} selected)
          </h2>
          <div className="max-h-64 overflow-y-auto space-y-1 p-4 rounded-xl bg-surface border border-border">
            {stems.slice(0, 50).map((stem) => (
              <button
                key={stem.id}
                onClick={() => toggleStem(stem.id)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg text-left text-sm transition-colors ${
                  selectedStems.includes(stem.id)
                    ? 'bg-accent/10 border border-accent/20'
                    : 'hover:bg-background'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                    selectedStems.includes(stem.id)
                      ? 'bg-accent border-accent'
                      : 'border-border'
                  }`}
                >
                  {selectedStems.includes(stem.id) && (
                    <Plus className="w-3 h-3 text-white rotate-45" />
                  )}
                </div>
                <span className="flex-1 truncate">{stem.title}</span>
                <span className="text-xs text-muted">{stem.instrument}</span>
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${result.startsWith('Error') ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
            {result}
          </div>
        )}

        <button
          onClick={handleCreate}
          disabled={creating}
          className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4" />
          {creating ? 'Creating...' : 'Create Flash Pack'}
        </button>
      </motion.div>
    </div>
  );
}
