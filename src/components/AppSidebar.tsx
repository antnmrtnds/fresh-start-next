
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { TrendingUp, Search, BarChart3, Settings, Users, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const menuItems = [
  {
    title: "Quick Create",
    icon: Search,
    url: "#",
    isActive: true,
  },
  {
    title: "Dashboard",
    icon: BarChart3,
    url: "#",
  },
  {
    title: "Analytics",
    icon: Activity,
    url: "#",
  },
  {
    title: "Competitors",
    icon: Users,
    url: "#",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "#",
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">UpSpy</h2>
            <p className="text-xs text-muted-foreground">Competitive Intelligence</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <a href={item.url} className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">UpSpy Team</p>
            <p className="text-xs text-muted-foreground truncate">team@upspy.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
