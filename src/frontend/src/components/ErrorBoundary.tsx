import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center px-5 text-center"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.12 0.01 260), oklch(0.115 0.008 250) 60%)",
          }}
        >
          <p className="text-4xl mb-4">😕</p>
          <h1 className="text-lg font-bold text-foreground mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Please reload the page to try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-full text-sm font-bold text-white"
            style={{ background: "oklch(0.585 0.195 260)" }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
