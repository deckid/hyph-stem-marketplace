function seededInt(seed: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return min + (Math.abs(hash) % (max - min + 1));
}

export const socialProof = {
  viewingNow: () => Math.floor(Math.random() * 8) + 9,
  boughtToday: (stemId: string) => seededInt(stemId, 12, 89),
  recentBuyers: [
    'FL_prod',
    'beatsby_k',
    'sxdbeats',
    'wavrunner',
    '808mafia_z',
    'kxngprod',
    'coldwave__',
  ],
};
