import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { format, parseISO } from "date-fns";
import { HealthLog } from "@/hooks/useHealthLogs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HealthTrendsProps {
  logs: HealthLog[];
  goalWeight?: number;
}

export const HealthTrends = ({ logs, goalWeight }: HealthTrendsProps) => {
  const weightData = logs
    .filter((l) => l.weight)
    .map((l) => ({
      date: format(parseISO(l.log_date), "MMM d"),
      weight: l.weight,
    }));

  const waterData = logs.map((l) => ({
    date: format(parseISO(l.log_date), "MMM d"),
    water: l.water_intake_ml || 0,
  }));

  const sleepData = logs
    .filter((l) => l.sleep_hours)
    .map((l) => ({
      date: format(parseISO(l.log_date), "MMM d"),
      sleep: l.sleep_hours,
    }));

  const stepsData = logs
    .filter((l) => l.steps > 0)
    .map((l) => ({
      date: format(parseISO(l.log_date), "MMM d"),
      steps: l.steps,
    }));

  const chartStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-semibold mb-4">Health Trends</h3>

      <Tabs defaultValue="weight">
        <TabsList className="mb-4">
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="water">Water</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="steps">Steps</TabsTrigger>
        </TabsList>

        <TabsContent value="weight">
          {weightData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis domain={["dataMin - 2", "dataMax + 2"]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={chartStyle} />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--neon-purple))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--neon-purple))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Log weight to see trends</p>
          )}
        </TabsContent>

        <TabsContent value="water">
          {waterData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={waterData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={chartStyle} />
                  <Area
                    type="monotone"
                    dataKey="water"
                    stroke="hsl(var(--neon-cyan))"
                    fill="hsl(var(--neon-cyan))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Log water to see trends</p>
          )}
        </TabsContent>

        <TabsContent value="sleep">
          {sleepData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis domain={[0, 12]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={chartStyle} />
                  <Bar dataKey="sleep" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Log sleep to see trends</p>
          )}
        </TabsContent>

        <TabsContent value="steps">
          {stepsData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stepsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={chartStyle} />
                  <Bar dataKey="steps" fill="hsl(var(--neon-green))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Log steps to see trends</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
