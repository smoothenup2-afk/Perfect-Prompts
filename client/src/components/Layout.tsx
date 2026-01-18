import { Link, useLocation } from "wouter";
import { Trophy, PlusCircle, LayoutDashboard, Calendar, Users, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/add", label: "Add Data", icon: PlusCircle },
    { href: "/history", label: "History", icon: Calendar },
    { href: "/players", label: "Players", icon: Users },
    { href: "/monthly", label: "Monthly", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-lg shadow-primary/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-display font-bold tracking-tight">
              Our Cricket
            </h1>
          </Link>

          <nav className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-white text-primary shadow-md"
                      : "text-primary-foreground/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground font-medium">
            Created by <span className="text-primary">Himanshu Singh Rajput</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
