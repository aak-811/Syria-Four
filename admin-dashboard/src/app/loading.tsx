export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[rgba(0,229,255,0.2)] border-t-[var(--primary)] rounded-full animate-spin" />
    </div>
  );
}
