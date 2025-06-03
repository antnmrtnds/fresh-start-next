
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-4 md:px-6">
      <SidebarTrigger />
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Competitive Intelligence Dashboard
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
          Live
        </Badge>
      </div>
    </header>
  )
}
