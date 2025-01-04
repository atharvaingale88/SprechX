import React, { Suspense, Component, ReactNode } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import TrendingProvider from './components/RightSidebar'; // Import TrendingProvider

// Lazy loading components
const CentralFeed = React.lazy(() => import('./components/CentralFeed'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const Notification = React.lazy(() => import('./pages/Notification'));
const Discover = React.lazy(() => import('./pages/Discover'));
const Messages = React.lazy(() => import('./pages/Messages'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));

// Error boundary component for handling lazy load errors
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try again later.</div>;
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <ErrorBoundary>
        <TrendingProvider> {/* Wrap with TrendingProvider */}
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<CentralFeed />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/notifications" element={<Notification />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/message" element={<Messages />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect unmatched paths */}
            </Routes>
          </Suspense>
        </TrendingProvider> {/* End of TrendingProvider */}
      </ErrorBoundary>
      <Footer />
    </Router>
  );
};

export default App;
