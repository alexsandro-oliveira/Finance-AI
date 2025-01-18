import AddTransactionButton from "@/app/_components/add-transaction-button";
import { Badge } from "@/app/_components/ui/badge";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { EyeIcon } from "lucide-react";
import type { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  className?: string;
  bg?: "primary" | "secondary";
  size?: "small" | "large";
}

const SummaryCard = ({
  icon,
  title,
  amount,
  bg,
  size = "small",
}: SummaryCardProps) => {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2">
        <Badge
          className={`${
            bg === "primary"
              ? "bg-primary/10 hover:bg-primary/10"
              : bg === "secondary"
                ? "bg-danger/10 hover:bg-danger/10"
                : "bg-white/10 hover:bg-white/10"
          } text-${bg}`}
        >
          {icon}
        </Badge>
        <p
          className={`text-sm ${size === "small" ? "text-muted-foreground" : "text-white opacity-70"}`}
        >
          {title}
        </p>
      </CardHeader>
      <CardContent className="flex justify-between">
        <div className="flex flex-row items-center gap-4">
          <p
            className={`font-bold ${size === "small" ? "text-2xl" : "text-4xl"}`}
          >
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(amount)}
          </p>
          {size === "large" && <EyeIcon />}
        </div>

        {size === "large" && <AddTransactionButton />}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
