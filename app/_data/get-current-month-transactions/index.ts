import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { endOfMonth, startOfMonth } from "date-fns";

export const getCurrentMonthTransactions = async () => {
  // Consultar quantidade de transações criadas pelo usuário dentro do mês atual
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return db.transaction.count({
    where: {
      userId,
      createdAt: {
        gte: startOfMonth(new Date()),
        lt: endOfMonth(new Date()),
      },
    },
  });
};
