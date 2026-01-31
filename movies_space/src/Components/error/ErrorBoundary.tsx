import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error boundary component for catching React errors
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center p-4">
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-8 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-400" size={32} />
              <h1 className="text-2xl font-bold text-red-400">Something went wrong</h1>
            </div>
            
            <p className="text-gray-300 mb-4">
              We encountered an unexpected error. Please try refreshing the page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 bg-slate-800 p-4 rounded border border-red-500/30">
                <summary className="cursor-pointer text-gray-300 font-mono text-sm">
                  Error Details
                </summary>
                <pre className="mt-2 text-red-300 text-xs overflow-auto max-h-32 font-mono">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <button
              onClick={this.resetError}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children || this.props.fallback;
  }
}

export default ErrorBoundary;
