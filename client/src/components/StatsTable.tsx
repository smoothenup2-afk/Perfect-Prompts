import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { type PlayerStats } from "@shared/schema";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRight, Trophy } from "lucide-react";

interface StatsTableProps {
  players: PlayerStats[];
}

export function StatsTable({ players }: StatsTableProps) {
  const maxRuns = Math.max(...players.map(p => p.totalRuns), 0);
  const maxWickets = Math.max(...players.map(p => p.totalWickets), 0);

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[200px] font-bold text-primary">Player</TableHead>
            <TableHead className="text-center font-bold">Matches</TableHead>
            <TableHead className="text-center font-bold">Runs</TableHead>
            <TableHead className="text-center font-bold">Wickets</TableHead>
            <TableHead className="text-center font-bold text-muted-foreground hidden md:table-cell">50s</TableHead>
            <TableHead className="text-center font-bold text-muted-foreground hidden md:table-cell">100s</TableHead>
            <TableHead className="text-center font-bold text-muted-foreground hidden md:table-cell">Best</TableHead>
            <TableHead className="text-right font-bold hidden lg:table-cell">Best Bowl</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => {
            const isOrangeCap = player.totalRuns > 0 && player.totalRuns === maxRuns;
            const isPurpleCap = player.totalWickets > 0 && player.totalWickets === maxWickets;

            return (
              <TableRow key={player.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">
                  <Link href={`/player/${player.id}`} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm group-hover:border-primary/20 transition-colors">
                      <AvatarImage src={player.imageUrl || undefined} alt={player.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {player.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`group-hover:text-primary transition-colors flex items-center gap-1 ${
                      isOrangeCap ? 'text-orange-500 font-bold' : isPurpleCap ? 'text-purple-600 font-bold' : ''
                    }`}>
                      {player.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="font-mono">{player.matches}</Badge>
                </TableCell>
                <TableCell className="text-center font-mono font-bold text-foreground">
                  <div className="flex flex-col items-center gap-1">
                    {player.totalRuns}
                    {isOrangeCap && (
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-[10px] h-4 px-1 gap-1 leading-none uppercase">
                        <Trophy className="w-2.5 h-2.5" />
                        Orange Cap
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center font-mono font-bold text-primary">
                  <div className="flex flex-col items-center gap-1">
                    {player.totalWickets}
                    {isPurpleCap && (
                      <Badge className="bg-purple-600 hover:bg-purple-700 text-[10px] h-4 px-1 gap-1 leading-none uppercase">
                        <Trophy className="w-2.5 h-2.5" />
                        Purple Cap
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center text-muted-foreground hidden md:table-cell">{player.fifties}</TableCell>
                <TableCell className="text-center text-muted-foreground hidden md:table-cell">{player.hundreds}</TableCell>
                <TableCell className="text-center text-muted-foreground font-mono hidden md:table-cell">{player.bestBatting}*</TableCell>
                <TableCell className="text-right font-mono text-sm hidden lg:table-cell">{player.bestBowling}</TableCell>
              </TableRow>
            );
          })}
          {players.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">
                No players found. Add some data to get started!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
