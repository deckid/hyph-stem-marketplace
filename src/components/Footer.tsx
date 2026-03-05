import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="Hyph" width={32} height={32} className="rounded-lg" />
              <span className="font-bold text-lg">Hyph</span>
            </div>
            <p className="text-sm text-muted">
              Premium audio stems crafted by independent creators worldwide.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">Browse</h4>
            <div className="space-y-2">
              <Link href="/browse" className="block text-sm text-muted hover:text-foreground transition-colors">
                All Stems
              </Link>
              <Link href="/browse?instrument=drums" className="block text-sm text-muted hover:text-foreground transition-colors">
                Drums
              </Link>
              <Link href="/browse?instrument=vocals" className="block text-sm text-muted hover:text-foreground transition-colors">
                Vocals
              </Link>
              <Link href="/browse?instrument=synth" className="block text-sm text-muted hover:text-foreground transition-colors">
                Synths
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">Company</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-sm text-muted hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/browse" className="block text-sm text-muted hover:text-foreground transition-colors">
                Creators
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">Legal</h4>
            <div className="space-y-2">
              <span className="block text-sm text-muted">Terms of Service</span>
              <span className="block text-sm text-muted">Privacy Policy</span>
              <span className="block text-sm text-muted">Licensing</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} Hyph. All rights reserved. Made with love for music.
        </div>
      </div>
    </footer>
  );
}
