"use client";

import { Component } from "react";
import GlassCard from "./GlassCard";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn("ErrorBoundary caught:", error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <GlassCard className="p-8 text-center">
          <AlertTriangle size={40} className="mx-auto text-[#FF3B30] mb-3" />
          <p className="text-[#9CA3AF] text-sm">حدث خطأ أثناء تحميل المحتوى</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 px-4 py-2 rounded-[10px] bg-[#00E5FF] text-[#050816] text-xs font-bold"
          >
            إعادة المحاولة
          </button>
        </GlassCard>
      );
    }
    return this.props.children;
  }
}
