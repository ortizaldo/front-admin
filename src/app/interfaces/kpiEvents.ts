export interface EventKpi {
  label: string;
  value: number;
  type: "upcoming" | "month" | "inProgress" | "finished";
}
