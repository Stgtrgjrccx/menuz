import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Menuz Application Error Caught by Boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '#/';
    window.location.reload();
  };

  private handleClearCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '#/';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-ivory-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-ivory-200 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600 border border-amber-200/80 shadow-inner">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                Menu View Recovered
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-700/80 leading-relaxed">
                We encountered a temporary rendering interruption while switching windows or menus. Your order and table session remain completely safe.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-charcoal-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-charcoal-800 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload View
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-ivory-100 text-charcoal-900 border border-ivory-200 rounded-xl text-xs sm:text-sm font-semibold hover:bg-ivory-200 transition-all active:scale-95 cursor-pointer"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </button>
            </div>

            <button
              type="button"
              onClick={this.handleClearCache}
              className="text-[11px] text-charcoal-400 hover:text-red-500 transition-colors underline cursor-pointer"
            >
              Reset local storage cache &amp; restore default catalog
            </button>

            {(typeof import.meta !== 'undefined' && import.meta.env?.DEV) && this.state.error && (
              <details className="text-left text-[11px] bg-charcoal-950 text-emerald-400 p-3 rounded-xl overflow-x-auto mt-4 font-mono">
                <summary className="cursor-pointer text-gray-400 font-semibold mb-1">
                  Technical Diagnostics
                </summary>
                <p className="font-bold text-rose-400">{this.state.error.toString()}</p>
                <pre className="mt-2 whitespace-pre-wrap text-[10px] text-gray-400">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
