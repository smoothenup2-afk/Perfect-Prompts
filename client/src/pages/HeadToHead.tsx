import { Layout } from "@/components/Layout";
import { useMatchStats, usePlayers } from "@/hooks/use-cricket";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Swords, Trophy, User } from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function HeadToHead() {
  const { data: stats, isLoading: isLoadingStats } = useMatchStats();
  const { data: players, isLoading: isLoadingPlayers } = usePlayers();
  
  const [player1Id, setPlayer1Id] = useState<string>("");
  const [player2Id, setPlayer2Id] = useState<string>("");

  const player1 = useMemo(() => players?.find(p => p.id.toString() === player1Id), [players, player1Id]);
  const player2 = useMemo(() => players?.find(p => p.id.toString() === player2Id), [players, player2Id]);

  const h2hStats = useMemo(() => {
    if (!stats || !player1Id || !player2Id) return null;

    const p1IdNum = parseInt(player1Id);
    const p2IdNum = parseInt(player2Id);

    // Times player 2 got player 1 out
    const p1OutByP2 = stats.filter(s => s.playerId === p1IdNum && s.wicketTakenBy === p2IdNum).length;
    
    // Times player 1 got player 2 out
    const p2OutByP1 = stats.filter(s => s.playerId === p2IdNum && s.wicketTakenBy === p1IdNum).length;

    return { p1OutByP2, p2OutByP1 };
  }, [stats, player1Id, player2Id]);

  if (isLoadingStats || isLoadingPlayers) {
    return <Layout><div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display font-bold text-primary flex items-center justify-center gap-3">
            <Swords className="h-8 w-8" />
            Head to Head
          </h2>
          <p className="text-muted-foreground">Compare wickets taken against each other.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <Card className="border-primary/10 shadow-md">
            <CardHeader className="text-center pb-2">
              <CardTitle>Player 1</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={player1Id} onValueChange={setPlayer1Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {players?.filter(p => p.id.toString() !== player2Id).map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-md">
            <CardHeader className="text-center pb-2">
              <CardTitle>Player 2</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={player2Id} onValueChange={setPlayer2Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {players?.filter(p => p.id.toString() !== player1Id).map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {player1 && player2 && h2hStats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-4">
            <Card className="text-center p-6 space-y-4 border-orange-200 bg-orange-50/30">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-16 w-16 border-4 border-white shadow-sm">
                  <AvatarFallback className="bg-orange-100 text-orange-600 text-xl font-bold">
                    {player1.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{player1.name}</h3>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Wickets vs {player2.name}</p>
                <p className="text-4xl font-display font-black text-orange-600">{h2hStats.p2OutByP1}</p>
              </div>
            </Card>

            <div className="flex flex-col items-center justify-center gap-4">
               <div className="bg-primary/10 p-4 rounded-full">
                 <Swords className="h-12 w-12 text-primary" />
               </div>
               <Badge variant="outline" className="px-4 py-1 text-lg font-bold">VS</Badge>
            </div>

            <Card className="text-center p-6 space-y-4 border-purple-200 bg-purple-50/30">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-16 w-16 border-4 border-white shadow-sm">
                  <AvatarFallback className="bg-purple-100 text-purple-600 text-xl font-bold">
                    {player2.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{player2.name}</h3>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Wickets vs {player1.name}</p>
                <p className="text-4xl font-display font-black text-purple-600">{h2hStats.p1OutByP2}</p>
              </div>
            </Card>
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-3xl bg-muted/20">
             <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
             <p className="text-lg text-muted-foreground">Select two players to compare their head-to-head records.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
