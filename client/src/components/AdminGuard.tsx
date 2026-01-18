import { useState } from "react";
import { useAdmin } from "@/lib/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, login } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (isAdmin) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Admin Access Required</CardTitle>
          <CardDescription>Enter the 4-digit admin password to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter 4-digit password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? "border-destructive focus-visible:ring-destructive" : ""}
                maxLength={4}
                autoFocus
              />
              {error && <p className="text-xs text-destructive font-medium">Incorrect password. Please try again.</p>}
            </div>
            <Button type="submit" className="w-full h-11 text-base">
              Unlock Section
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
