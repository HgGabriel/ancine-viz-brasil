import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/useResponsive';

interface HeaderProps {
  title?: string;
  showThemeToggle?: boolean;
  onMenuClick?: () => void;
}

export function Header({ title, showThemeToggle = true, onMenuClick }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const { isMobile } = useResponsive();

  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-20">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          {isMobile && onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="h-9 w-9 lg:hidden"
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          )}
          
          {title && (
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                {title}
              </h1>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {showThemeToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 flex-shrink-0"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Alternar tema</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}