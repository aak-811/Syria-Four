import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-[var(--border)] mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
              <span className="text-white font-black text-[10px]">S4</span>
            </div>
            <span>SYRIA FOUR &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-white transition-colors">من نحن</Link>
            <Link href="/contact" className="hover:text-white transition-colors">اتصل بنا</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
