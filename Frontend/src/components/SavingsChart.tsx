import { PieChart, Pie, Cell, Label } from "recharts";

type Props = {
  totalSpent: number;
  goal: number;
};

const COLORS = ["#1f9d8a", "#e5e7eb"];

export default function SavingsChart({ totalSpent, goal }: Props) {

  const percent = goal > 0 ? (totalSpent / goal) * 100 : 0

  const data = [
    { name: "Spent", value: Math.min(totalSpent, goal) },
    { name: "Remaining", value: Math.max(goal - totalSpent, 0) }
  ];

  return (
    <PieChart width={250} height={250}>
      <Pie
        data={data}
        dataKey="value"
        innerRadius={60}
        outerRadius={90}
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
        
        <Label 
          value={`${percent.toFixed(0)}%`}
          position="center"
        />
      </Pie>
    </PieChart>
  );
}