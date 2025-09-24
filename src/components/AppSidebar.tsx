import { NavLink, useLocation } from "react-router-dom";
import { 
  User, 
  Building2, 
  Baby, 
  Heart, 
  PenTool, 
  Home, 
  Car, 
  Phone, 
  BrainCircuit,
  UserPlus,
  Users,
  BookOpen,
  LayoutDashboard,
  Settings,
  Crown
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Criar Mapa para Cliente", url: "/criar-mapa-cliente", icon: UserPlus },
  { title: "Gerenciar Clientes", url: "/admin/clientes", icon: Users },
];

const analysisTools = [
  { title: "Mapa Pessoal", url: "/mapa-pessoal", icon: User },
  { title: "Mapa Empresarial", url: "/mapa-empresarial", icon: Building2 },
  { title: "Mapa Infantil", url: "/mapa-infantil", icon: Baby },
  { title: "Harmonia Conjugal", url: "/harmonia-conjugal", icon: Heart },
  { title: "Correção de Assinatura", url: "/correcao-assinatura", icon: PenTool },
  { title: "Análise de Endereço", url: "/analise-endereco", icon: Home },
  { title: "Análise de Placa", url: "/analise-placa", icon: Car },
  { title: "Análise de Telefone", url: "/analise-telefone", icon: Phone },
];

const administrationItems = [
  { title: "Biblioteca de Conhecimento", url: "/biblioteca-conhecimento", icon: BookOpen },
  { title: "Áreas de Atuação", url: "/areas-atuacao", icon: BrainCircuit },
  { title: "Administração", url: "/admin", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavClasses = (path: string) =>
    isActive(path) 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* App Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Crown className="h-4 w-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <h1 className="text-lg font-bold text-sidebar-foreground">
                Numapp
              </h1>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegação Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Analysis Tools */}
        <SidebarGroup>
          <SidebarGroupLabel>Ferramentas de Análise</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analysisTools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Administration */}
        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {administrationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}