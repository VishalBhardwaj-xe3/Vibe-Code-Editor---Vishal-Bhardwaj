import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundForUser } from "@/modules/dashboard/action";
import { DashboardSidebar } from "@/modules/dashboard/component/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
    }) {
    
    const playgroundData = await getAllPlaygroundForUser();

      console.log("playgrounddata", playgroundData);
      
  
  
    const technologyIconMap: Record<string, string> = {
      REACT: "Zap",
      NEXTJS: "Lightbulb",
      EXPRESS: "Database",
      VUE: "Compass",
      HONO: "FlameIcon",
      ANGULAR: "Terminal",
    };

    const formattedPlaygroundData = playgroundData?.map((item) => ({
        id: item.id,
        name: item.title,
        starred: item.StarMark?.[0]?.isMarked || false,
        icon:technologyIconMap[item.template] || "code2"
    }))
    
    return (
      <SidebarProvider>
    <div className="flexx min-h-screen w-full overflow-x-hidden">
                {/* Dashboard Sidebar */}
                {/* @ts-ignore */}
                <DashboardSidebar initialPlaygroundData={formattedPlaygroundData}/>
      <main className="flex-1">{children}</main>
    </div>
  </SidebarProvider>
  )
}
