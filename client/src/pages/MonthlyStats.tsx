import { Layout } from "@/components/Layout";
import { useMatchStats, usePlayers } from "@/hooks/use-cricket";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function MonthlyStats() {
  const { data: stats, isLoading: isLoadingStats } = useMatchStats();
  const { data: players, isLoading: isLoadingPlayers } = usePlayers();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  }, []);

  const filteredStats = useMemo(() => {
    if (!stats) return [];
    const targetDate = new Date(parseInt(selectedYear), parseInt(selectedMonth), 1);
    const start = startOfMonth(targetDate);
    const end = endOfMonth(targetDate);

    return stats.filter(s => {
      const d = new Date(s.date);
      return isWithinInterval(d, { start, end });
    });
  }, [stats, selectedMonth, selectedYear]);

  const monthlyPlayerStats = useMemo(() => {
    if (!players) return [];

    return players.map(player => {
      const pStats = filteredStats.filter(s => s.playerId === player.id);
      const runs = pStats.reduce((sum, s) => sum + s.runs, 0);
      const wickets = pStats.reduce((sum, s) => sum + s.wickets, 0);
      const matches = pStats.length;

      return {
        ...player,
        monthlyRuns: runs,
        monthlyWickets: wickets,
        monthlyMatches: matches
      };
    }).filter(p => p.monthlyMatches > 0).sort((a, b) => b.monthlyRuns - a.monthlyRuns);
  }, [players, filteredStats]);

  if (isLoadingStats || isLoadingPlayers) {
    return <Layout><div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h2 className="text-3xl font-display font-bold text-primary flex items-center gap-2">
              <TrendingUp className="h-8 w-8" />
              Monthly Performance
            </h2>
            <p className="text-muted-foreground">View top performers for a specific month.</p>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map(m => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle>Stats for {months[parseInt(selectedMonth)].label} {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {monthlyPlayerStats.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-center">Matches</TableHead>
                    <TableHead className="text-center text-orange-600 font-bold">Runs</TableHead>
                    <TableHead className="text-center text-purple-600 font-bold">Wickets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyPlayerStats.map((p, idx) => (
                    <TableRow key={p.id} className={idx === 0 ? "bg-orange-50/50" : ""}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {idx === 0 && <Badge className="bg-orange-500">MVP</Badge>}
                        {p.name}
                      </TableCell>
                      <TableCell className="text-center">{p.monthlyMatches}</TableCell>
                      <TableCell className="text-center font-mono font-bold">{p.monthlyRuns}</TableCell>
                      <TableCell className="text-center font-mono font-bold">{p.monthlyWickets}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No matches recorded for this period.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
