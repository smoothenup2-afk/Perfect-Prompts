import { Layout } from "@/components/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMatchStatsSchema, type InsertMatchStats } from "@shared/schema";
import { useAddStats, usePlayers } from "@/hooks/use-cricket";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Schema for the form - ensuring numbers are coerced
const formSchema = insertMatchStatsSchema.extend({
  playerId: z.coerce.number(),
  runs: z.coerce.number().min(0),
  ballsFaced: z.coerce.number().min(0),
  fours: z.coerce.number().min(0),
  sixes: z.coerce.number().min(0),
  wickets: z.coerce.number().min(0),
  oversBowled: z.string().regex(/^\d+(\.[0-6])?$/, "Invalid overs format (e.g. 4 or 4.2)"),
  runsConceded: z.coerce.number().min(0),
  wicketTakenBy: z.coerce.number().optional().nullable(),
});

export default function AddData() {
  const { data: players, isLoading: isLoadingPlayers } = usePlayers();
  const addStats = useAddStats();

  const form = useForm<InsertMatchStats>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      runs: 0,
      ballsFaced: 0,
      fours: 0,
      sixes: 0,
      wickets: 0,
      oversBowled: "0",
      runsConceded: 0,
    },
  });

  const onSubmit = (data: InsertMatchStats) => {
    // Explicitly set removed fields to 0 or appropriate defaults
    const payload = {
      ...data,
      ballsFaced: 0,
      oversBowled: "0",
      runsConceded: 0,
    };
    addStats.mutate(payload, {
      onSuccess: () => {
        form.reset({
          ...form.getValues(), // keep date and player if convenient? Maybe reset player.
          playerId: form.getValues().playerId, // keep player selected
          runs: 0,
          ballsFaced: 0,
          fours: 0,
          sixes: 0,
          wickets: 0,
          oversBowled: "0",
          runsConceded: 0,
        });
      }
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="border shadow-lg">
          <CardHeader className="bg-muted/30 pb-6 border-b">
            <CardTitle className="text-2xl font-display text-primary">Add Match Performance</CardTitle>
            <CardDescription>
              Record batting and bowling figures for a player.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date & Player Selection */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Match Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="date" {...field} className="pl-10" />
                            <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="playerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Player</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString()}
                          disabled={isLoadingPlayers}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a player" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {players?.map((player) => (
                              <SelectItem key={player.id} value={player.id.toString()}>
                                {player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Batting Stats</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="runs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Runs</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="font-mono" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>4s</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="font-mono" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sixes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>6s</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="font-mono" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Bowling Stats</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="wickets"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wickets Taken</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="font-mono" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="wicketTakenBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Out By (Wicket taken by)</FormLabel>
                          <Select
                            onValueChange={(val) => field.onChange(val === "not_out" ? null : parseInt(val))}
                            value={field.value?.toString() || "not_out"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select player" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="not_out">Not Out</SelectItem>
                              {players?.filter(p => p.id !== form.watch("playerId")).map((player) => (
                                <SelectItem key={player.id} value={player.id.toString()}>
                                  {player.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs">Select who took this player's wicket</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20" 
                    disabled={addStats.isPending}
                  >
                    {addStats.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save Match Stats"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
