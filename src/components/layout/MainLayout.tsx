import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useResponsiveSidebar } from '@/hooks/useResponsive';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const {
    isCollapsed,
    isMobileOpen,
    toggleSidebar,
    closeMobileSidebar,
    shouldShowOverlay,
  } = useResponsiveSidebar();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar 
          isCollapsed={isCollapsed}
          isMobileOpen={isMobileOpen}
          onToggle={toggleSidebar}
          onCloseMobile={closeMobileSidebar}
        />
        
        {/* Mobile overlay */}
        {shouldShowOverlay && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={closeMobileSidebar}
          />
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            showThemeToggle={true}
            onMenuClick={toggleSidebar}
          />
          
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}