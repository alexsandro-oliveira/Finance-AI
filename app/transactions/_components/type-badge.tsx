import { Badge } from "@/app/_components/ui/badge";
import { TransactionType, Transaction } from "@prisma/client";
import { CircleIcon } from "lucide-react";

interface TransactionTypeBadgeProps {
  transaction: Transaction;
}

const TransactionTypeBadge = ({ transaction }: TransactionTypeBadgeProps) => {
  if (transaction.type === TransactionType.DEPOSIT) {
    return (
      <Badge className="bg-muted font-bold text-primary hover:bg-muted">
        <CircleIcon className="mr-2 fill-primary" size={8} />
        Depósito
      </Badge>
    );
  }
  if (transaction.type === TransactionType.EXPENSE) {
    return (
      <Badge className="bg-danger bg-opacity-10 font-bold text-danger">
        <CircleIcon className="mr-2 fill-danger" size={8} />
        Despesa
      </Badge>
    );
  }
  return (
    <Badge className="bg-white bg-opacity-10 font-bold text-white">
      <CircleIcon className="mr-2 fill-white" size={8} />
      Investimento
    </Badge>
  );
};

export default TransactionTypeBadge;
