import * as React from 'react';

type ErrorBoundaryProps = {
    children: React.ReactNode;
    fallback: React.ReactNode;
}

type ErrorBoundaryState = {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {hasError: false}
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return {hasError: true};
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error(
            error,

            info.componentStack,

            React.captureOwnerStack(),
        );
    }

    render () {
        if (this.state.hasError) {
            return this.props.fallback
        }

        return this.props.children;
    }
}
