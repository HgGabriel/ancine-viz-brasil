import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Film, 
  Share2, 
  MapPin, 
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAVIGATION_ITEMS } from '@/lib/constants';
import { useResponsive } from '@/hooks/useResponsive';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Icon mapping
const iconMap = {
  BarChart3,
  TrendingUp,
  Film,
  Share2,
  MapPin,
  Globe,
};

interface SidebarProps {
  isCollapsed?: boolean;
  isMobileOpen?: boolean;
  onToggle?: () => void;
  onCloseMobile?: () => void;
}

export function Sidebar({ 
  isCollapsed = false, 
  isMobileOpen = false,
  onToggle,
  onCloseMobile 
}: SidebarProps) {
  const location = useLocation();
  const { isMobile } = useResponsive();

  const handleLinkClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const NavigationItem = ({ item }: { item: typeof NAVIGATION_ITEMS[0] }) => {
    const Icon = iconMap[item.icon as keyof typeof iconMap];
    const isActive = location.pathname === item.href;

    const linkContent = (
      <Link
        to={item.href}
        onClick={handleLinkClick}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          "hover:bg-accent hover:text-accent-foreground group relative",
          isActive 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground",
          isCollapsed && "justify-center px-2"
        )}
      >
        <Icon className={cn(
          "flex-shrink-0 transition-transform duration-200",
          "group-hover:scale-110",
          isCollapsed ? "h-5 w-5" : "h-4 w-4"
        )} />
        {!isCollapsed && (
          <span className="truncate transition-opacity duration-200">
            {item.label}
          </span>
        )}
        {isActive && !isCollapsed && (
          <div className="absolute right-2 w-1.5 h-1.5 bg-primary-foreground rounded-full" />
        )}
      </Link>
    );

    // Wrap with tooltip when collapsed
    if (isCollapsed && !isMobile) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {linkContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  return (
    <aside className={cn(
      "fixed lg:static inset-y-0 left-0 z-40 bg-card border-r transition-all duration-300 ease-in-out",
      "lg:translate-x-0 flex flex-col",
      isMobile 
        ? cn(
            "w-64",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )
        : cn(
            "translate-x-0",
            isCollapsed ? "w-16" : "w-64"
          )
    )}>
      {/* Header */}
      <div className={cn(
        "border-b transition-all duration-300",
        isCollapsed && !isMobile ? "p-4" : "p-6"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "bg-primary rounded-lg flex items-center justify-center transition-all duration-300",
            isCollapsed && !isMobile ? "w-8 h-8" : "w-10 h-10"
          )}>
            <BarChart3 className={cn(
              "text-primary-foreground transition-all duration-300",
              isCollapsed && !isMobile ? "h-4 w-4" : "h-5 w-5"
            )} />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="transition-opacity duration-300">
              <h1 className="text-lg font-bold text-foreground">ANCINE</h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          )}
        </div>
        
        {/* Collapse toggle for desktop */}
        {!isMobile && onToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              "absolute -right-3 top-6 h-6 w-6 rounded-full border bg-background shadow-md",
              "hover:bg-accent transition-all duration-200",
              "hidden lg:flex items-center justify-center"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 transition-all duration-300",
        isCollapsed && !isMobile ? "p-2" : "p-4"
      )}>
        <ul className="space-y-1">
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item.id}>
              <NavigationItem item={item} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className={cn(
        "border-t transition-all duration-300",
        isCollapsed && !isMobile ? "p-2" : "p-4"
      )}>
        {(!isCollapsed || isMobile) && (
          <div className="text-xs text-muted-foreground space-y-1 transition-opacity duration-300">
            <p className="font-medium">Agência Nacional do Cinema</p>
            <p>Dados públicos do setor audiovisual</p>
          </div>
        )}
        {isCollapsed && !isMobile && (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}