import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ArrowLeft, 
  Sparkles, 
  ChevronDown,
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Home
} from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, description }) => {
  const location = useLocation();
  
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs = [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }
    ];

    if (path.includes('/admin/clientes')) {
      breadcrumbs.push({ label: 'Gestão de Clientes', href: '/admin/clientes', icon: Users });
    } else if (path.includes('/admin')) {
      breadcrumbs.push({ label: 'Administração', href: '/admin', icon: Settings });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 border-b border-border">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-4">
          {/* Logo e Navegação Principal */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-gradient-cosmic">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
                Numapp
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Início
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>

          {/* Menu Administrativo */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Administração
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/admin/clientes">
                    <Users className="h-4 w-4 mr-2" />
                    Gestão de Clientes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin">
                    <FileText className="h-4 w-4 mr-2" />
                    Upload de Conteúdo
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Voltar ao Dashboard
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage className="flex items-center">
                        <crumb.icon className="h-4 w-4 mr-2" />
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.href} className="flex items-center">
                          <crumb.icon className="h-4 w-4 mr-2" />
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;