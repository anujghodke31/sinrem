import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/site/Header';
import { Footer } from './components/site/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { Preloader } from './components/ui/Preloader';
import { site } from './lib/site';
import HomePage from './pages/Home';

// --- Priority 3: On-Demand Pages (Lazy loaded on navigation) ---
const ServicesPage = React.lazy(() => import('./pages/Services'));
const CaseStudiesPage = React.lazy(() => import('./pages/CaseStudies'));
const CaseStudyDetailPage = React.lazy(() => import('./pages/CaseStudyDetail'));
const AboutPage = React.lazy(() => import('./pages/About'));
const ContactPage = React.lazy(() => import('./pages/Contact'));
const TechnologiesPage = React.lazy(() => import('./pages/Technologies'));
const BlogPage = React.lazy(() => import('./pages/Blog'));
const AcademyPage = React.lazy(() => import('./pages/Academy'));
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
              <Route path="/about" element={<AboutPage />} />
              <Route path="/technologies" element={<TechnologiesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/connect" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/academy" element={<AcademyPage />} />
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
        
        {/* WhatsApp floating button */}
        <a
          href={site.whatsappLink}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-6 right-6 z-[9998] h-14 w-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] flex items-center justify-center transition-all duration-300 hover:scale-105"
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}