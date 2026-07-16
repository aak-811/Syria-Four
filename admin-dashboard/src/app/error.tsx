"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl mx-auto mb-6 bg-gradient-to-br from-[var(--danger)] to-[#FF6B35] flex items-center justify-center">
          <span className="text-white font-black text-3xl">!</span>
        </div>
        <h1 className="text-2xl font-black mb-2">حدث خطأ</h1>
        <p className="text-[var(--text-muted)] mb-8">عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.</p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-[12px] bg-[var(--primary)] text-[var(--bg)] font-semibold hover:brightness-110 transition-all"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}
