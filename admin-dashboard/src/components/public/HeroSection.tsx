export default function HeroSection() {
  return (
    <div className="text-center py-12 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,229,255,0.06)] via-transparent to-[rgba(139,92,246,0.04)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[rgba(0,229,255,0.03)] blur-[100px] pointer-events-none" />

      <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl mx-auto mb-6 shadow-[0_0_60px_rgba(0,229,255,0.3)] bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
        <span className="text-white font-black text-3xl md:text-4xl tracking-tighter">S4</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-black mb-3 gradient-text">
        SYRIA FOUR
      </h1>
      <p className="text-[var(--text-muted)] text-lg md:text-xl">
        كلان فري فاير - القمة تبدأ من هنا
      </p>
    </div>
  );
}
