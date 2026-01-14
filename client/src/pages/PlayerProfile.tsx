import { Layout } from "@/components/Layout";
import { usePlayer } from "@/hooks/use-cricket";
import { useRoute } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Trophy, TrendingUp, Target, Activity } from "lucide-react";

export default function PlayerProfile() {
  const [match, params] = useRoute("/player/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: player, isLoading, error } = usePlayer(id);

  if (!match) return null;

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center p-8 text-destructive">Player not found</div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
          <div className="h-48 bg-muted rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64 bg-muted rounded-xl" />
            <div className="h-64 bg-muted rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!player) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Profile Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/90 to-primary text-white shadow-xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
          
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white/20 shadow-2xl">
              <AvatarImage src={player.imageUrl || undefined} alt={player.name} className="object-cover" />
              <AvatarFallback className="text-4xl font-bold bg-white text-primary">
                {player.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left space-y-2">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none mb-2">
                {player.role}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white drop-shadow-md">
                {player.name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-6 text-primary-foreground/90 mt-4 font-medium">
                <div className="flex flex-col">
                  <span className="text-xs uppercase opacity-70 tracking-wider">Matches</span>
                  <span className="text-2xl font-display">{player.matches}</span>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase opacity-70 tracking-wider">Runs</span>
                  <span className="text-2xl font-display">{player.totalRuns}</span>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase opacity-70 tracking-wider">Wickets</span>
                  <span className="text-2xl font-display">{player.totalWickets}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Batting Card */}
          <Card className="border shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-blue-50/50 border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Batting Career</CardTitle>
                  <p className="text-xs text-muted-foreground">Aggregated batting performance</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <StatItem label="Average" value={player.battingAverage} sub="Runs / Out" />
                <StatItem label="Strike Rate" value={player.strikeRate} sub="Runs / 100 balls" />
                <StatItem label="Best Score" value={`${player.bestBatting}*`} highlight />
                <StatItem label="Hundreds" value={player.hundreds} />
                <StatItem label="Fifties" value={player.fifties} />
                <StatItem label="Total 4s/6s" value={`${player.fours || 0} / ${player.sixes || 0}`} />
              </div>
            </CardContent>
          </Card>

          {/* Bowling Card */}
          <Card className="border shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-orange-50/50 border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Bowling Career</CardTitle>
                  <p className="text-xs text-muted-foreground">Aggregated bowling performance</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <StatItem label="Average" value={player.bowlingAverage} sub="Runs / Wicket" />
                <StatItem label="Economy" value={player.economyRate} sub="Runs / Over" />
                <StatItem label="Best Bowling" value={player.bestBowling} highlight />
                <StatItem label="Total Wickets" value={player.totalWickets} />
                <StatItem label="Balls Bowled" value={player.totalBalls} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function StatItem({ label, value, sub, highlight }: { label: string, value: string | number, sub?: string, highlight?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground font-medium mb-1">{label}</span>
      <span className={cn("text-2xl font-display font-bold tracking-tight", highlight ? "text-primary" : "text-foreground")}>
        {value}
      </span>
      {sub && <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-semibold mt-1">{sub}</span>}
    </div>
  );
}
