import { Layout } from "@/components/Layout";
import { usePlayers } from "@/hooks/use-cricket";
import { StatsTable } from "@/components/StatsTable";
import { Loader2, Plus, Users, Trophy, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: players, isLoading, error } = usePlayers();

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
          <div className="text-destructive mb-2 font-semibold">Unable to load cricket data</div>
          <p className="text-muted-foreground mb-4">Please check your connection and try again.</p>
        </div>
      </Layout>
    );
  }

  // Calculate simple dashboard metrics
  const totalMatches = players?.reduce((acc, p) => acc + p.matches, 0) || 0;
  const topRunScorer = players?.reduce((prev, current) => (prev.totalRuns > current.totalRuns) ? prev : current, players[0]);
  const topWicketTaker = players?.reduce((prev, current) => (prev.totalWickets > current.totalWickets) ? prev : current, players[0]);

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground">Dashboard</h2>
            <p className="text-muted-foreground mt-1">Overview of team performance and player statistics.</p>
          </div>
          <Link href="/add">
            <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              <Plus className="mr-2 h-4 w-4" /> Add Match Data
            </Button>
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold font-display">{totalMatches}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Recorded across all players</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Run Scorer</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold font-display truncate">
                  {topRunScorer?.name || "N/A"}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {topRunScorer ? `${topRunScorer.totalRuns} runs` : "No runs yet"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Wicket Taker</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold font-display truncate">
                  {topWicketTaker?.name || "N/A"}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {topWicketTaker ? `${topWicketTaker.totalWickets} wickets` : "No wickets yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Stats Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-bold">Player Statistics</h3>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <StatsTable players={players || []} />
          )}
        </div>
      </div>
    </Layout>
  );
}
