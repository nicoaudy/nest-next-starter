import { DashboardNav } from "@/components/dashboard-nav";
import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("py-16 border", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">
            Overview
          </h2>
          <div className="space-y-1">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
      <div className="px-3 py-2">
        <UserNav />
      </div>
    </div>
  );
}
