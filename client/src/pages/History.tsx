import { Layout } from "@/components/Layout";
import { useMatchStats, useDeleteStats, usePlayers, useUpdateStats } from "@/hooks/use-cricket";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Edit2, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMatchStatsSchema, type MatchStats } from "@shared/schema";
import { z } from "zod";

const formSchema = insertMatchStatsSchema.extend({
  playerId: z.coerce.number(),
  runs: z.coerce.number().min(0),
  ballsFaced: z.coerce.number().min(0),
  fours: z.coerce.number().min(0),
  sixes: z.coerce.number().min(0),
  wickets: z.coerce.number().min(0),
  oversBowled: z.string().regex(/^\d+(\.[0-6])?$/, "Invalid overs format"),
  runsConceded: z.coerce.number().min(0),
});

function EditStatsDialog({ stats }: { stats: MatchStats }) {
  const [open, setOpen] = useState(false);
  const updateStats = useUpdateStats();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...stats,
      date: format(new Date(stats.date), "yyyy-MM-dd"),
    },
  });

  const onSubmit = (data: any) => {
    updateStats.mutate({ id: stats.id, ...data }, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Match Performance</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="runs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Runs</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="wickets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wickets</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="oversBowled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overs</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={updateStats.isPending}>
              {updateStats.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function History() {
  const { data: stats, isLoading } = useMatchStats();
  const { data: players } = usePlayers();
  const deleteStats = useDeleteStats();

  if (isLoading) return <Layout><div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Match History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-center">Runs</TableHead>
                  <TableHead className="text-center">Wickets</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(s.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {players?.find(p => p.id === s.playerId)?.name || "Unknown"}
                    </TableCell>
                    <TableCell className="text-center">{s.runs}</TableCell>
                    <TableCell className="text-center">{s.wickets}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <EditStatsDialog stats={s} />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-destructive"
                        onClick={() => {
                          if (confirm("Delete this performance?")) deleteStats.mutate(s.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
