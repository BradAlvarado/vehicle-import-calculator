import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './state/i18n';

// Simple error boundary to surface runtime errors instead of silent blank screen
class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, { error?: Error }> {
	constructor(props: { children: React.ReactNode }) {
		super(props);
		this.state = { error: undefined };
	}
	static getDerivedStateFromError(error: Error) { return { error }; }
	componentDidCatch(error: Error, info: any) { console.error('App crash:', error, info); }
	render() {
		if (this.state.error) {
			return (
				<div style={{ fontFamily: 'system-ui', padding: 24 }}>
					<h1 style={{ fontSize: 20, color: '#b91c1c' }}>Application Error</h1>
					<p>{this.state.error.message}</p>
					<pre style={{ whiteSpace: 'pre-wrap', background:'#f1f5f9', padding:12, border:'1px solid #cbd5e1' }}>{this.state.error.stack}</pre>
				</div>
			);
		}
		return this.props.children;
	}
}

console.log('[CR Import Calculator] Bootstrapping app...');

const rootEl = document.getElementById('root');
if (!rootEl) {
	console.error('Root element #root not found – index.html might be altered.');
} else {
	ReactDOM.createRoot(rootEl).render(
		<RootErrorBoundary>
			<App />
		</RootErrorBoundary>
	);
}
