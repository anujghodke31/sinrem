import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/site/Header';
import { Footer } from './components/site/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { AiProvider } from './context/AiContext';
import { Preloader } from './components/ui/Preloader';
import HomePage from './pages/Home';

// --- Priority 2: Chatbot (Lazy loaded immediately after main bundle) ---
// Using .then() to handle the named export 'AiOrb'
const AiOrb = React.lazy(() => import('./components/site/AiOrb').then(module => ({ default: module.AiOrb })));

// --- Priority 3: On-Demand Pages (Lazy loaded on navigation) ---
const ServicesPage = React.lazy(() => import('./pages/Services'));
const CaseStudiesPage = React.lazy(() => import('./pages/CaseStudies'));
const CaseStudyDetailPage = React.lazy(() => import('./pages/CaseStudyDetail'));
const PricingPage = React.lazy(() => import('./pages/Pricing'));
const AboutPage = React.lazy(() => import('./pages/About'));
const ContactPage = React.lazy(() => import('./pages/Contact'));
const LoginPage = React.lazy(() => import('./pages/Login'));
const DashboardPage = React.lazy(() => import('./pages/Dashboard'));
const NotFoundPage = React.lazy(() => import('./pages/NotFound'));
const CareersPage = React.lazy(() => import('./pages/Careers'));

// Tools / Labs Routes
const StackArchitectPage = React.lazy(() => import('./pages/tools/StackArchitect'));
const RoiCalculatorPage = React.lazy(() => import('./pages/tools/RoiCalculator'));
const PacketFlowPage = React.lazy(() => import('./pages/games/PacketFlow'));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Loading Fallback for Routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg transition-colors duration-300">
    <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showHeroAnim, setShowHeroAnim] = useState(false);
  const location = useLocation();

  // 1. Lock Body Scroll during Preloading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
      // Ensure we start at top
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = '';
    }
  }, [isLoading]);

  // 2. Reset Animation State on Navigation
  useEffect(() => {
    if (location.pathname !== '/') {
      setShowHeroAnim(false);
    }
  }, [location]);

  const handleLoadComplete = () => {
    setIsLoading(false);
    setShowHeroAnim(true);
  };

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader key="preloader" onLoadingComplete={handleLoadComplete} />
        )}
      </AnimatePresence>
      
      <div className="flex min-h-screen flex-col bg-bg transition-colors duration-300">
        <Header />
        <div className="flex-1">
          {/* Wrap Routes in Suspense for On-Demand Loading */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Priority 1: Home Page (Static) */}
              <Route 
                path="/" 
                element={<HomePage isPreloading={isLoading} shouldAnimate={showHeroAnim} />} 
              />
              
              {/* Priority 3: Lazy Routes */}
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/case-studies" element={<CaseStudiesPage />} />
              <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/careers" element={<CareersPage />} />
              
              {/* Tools / Labs */}
              <Route path="/tools/stack-architect" element={<StackArchitectPage />} />
              <Route path="/tools/roi-calculator" element={<RoiCalculatorPage />} />
              <Route path="/games/packet-flow" element={<PacketFlowPage />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
        
        {/* Priority 2: Chatbot (Lazy loaded, no fallback needed as it floats) */}
        <Suspense fallback={null}>
          <AiOrb />
        </Suspense>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AiProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AiProvider>
    </ThemeProvider>
  );
}