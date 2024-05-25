import { Component } from 'react';

interface ErrorBoundaryProps extends React.PropsWithChildren {}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <div className="d-flex flex-column flex-lg-grow-1 gap-3">
          <div className="h1 text-danger">
            <i className="bi bi-bug-fill me-3" />
            Error
          </div>
          <div className="h3">{error.message}</div>
          {error.stack && <div className="font-monospace">{error.stack}</div>}
        </div>
      );
    }

    return this.props.children;
  }
}
