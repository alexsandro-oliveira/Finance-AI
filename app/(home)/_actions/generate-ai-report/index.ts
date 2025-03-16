"use server";

import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { generateAiReportSchema, type GenerateAiReportSchema } from "./schema";

// cópia do relatório gerado pelo ChatGPT para ser utilizado no teste
const DUMMY_REPORT =
  '**Relatório de Finanças Pessoais**\n\n**Data da Análise:** Março de 2025\n\n**Visão Geral das Transações:**\n\nTransações registradas:  \n1. **Receitas:**\n   - R$2345 - DEPÓSITO (OUTROS)\n   - R$6500 - SALÁRIO\n\n2. **Despesas:**\n   - R$50 - DESPESA (OUTROS)\n   - R$50 - DESPESA (OUTROS)\n   - R$50 - DESPESA (OUTROS)\n   - R$50 - DESPESA (OUTROS)\n   - R$5000 - DESPESA (OUTROS)\n   - R$1344 - DESPESA (SAÚDE)\n   - R$123 - DESPESA (TRANSPORTE)\n\n**Total de Receitas:** R$8845  \n**Total de Despesas:** R$5877  \n**Saldo Final:** R$2968  \n\n---\n\n### **Análise das Finanças:**\n\n1. **Receitas vs. Despesas:**\n   - Você teve um saldo positivo (R$2968), o que é um bom sinal de que suas receitas superam suas despesas.\n   - O salário representa a maior parte de suas receitas, enquanto os depósitos menores não compensam despesas significativas.\n\n2. **Categorias de Despesas:**\n   - As despesas podem ser divididas em "OUTROS" (R$5050), "SAÚDE" (R$1344) e "TRANSPORTE" (R$123).\n   - A maior parte das suas despesas (R$5050) está categorizada como "OUTROS", o que pode indicar falta de controle ou clareza nessa categoria.\n\n### **Insights e Dicas de Melhoria Financeira:**\n\n1. **Classificação das Despesas:**\n   - Reavalie suas despesas, especialmente aquelas classificadas como "OUTROS". Tente detalhar onde exatamente esse dinheiro está indo (ex: alimentação, lazer, compras).\n   - Implemente um sistema de categorização mais específico para entender melhor onde você pode economizar.\n\n2. **Orçamento Mensal:**\n   - Crie um orçamento detalhado baseado nas suas receitas e despesas mensais. Determine limites para cada categoria e monitore suas despesas diariamente ou semanalmente.\n\n3. **Fundo de Emergência:**\n   - Considere estabelecer um fundo de emergência. Idealmente, você deve ter entre 3 a 6 meses de despesas cobertas. Com o saldo atual, você está a um passo de atingir esse objetivo.\n\n4. **Revisão de Despesas:**\n   - Revise suas despesas fixas e variáveis para identificar oportunidades de economia. Pergunte-se se todas as despesas são realmente necessárias ou se poderiam ser reduzidas.\n\n5. **Investimentos:**\n   - Assim que sua situação financeira estiver sob controle e você tiver um fundo de emergência, comece a considerar investir. Explore opções adequadas ao seu perfil, como ações, fundos de renda fixa, ou previdência privada.\n\n6. **Avalie Cuidados com a Saúde:**\n   - A despesa com saúde (R$1344) é significativa. Considere analisar se possui um plano de saúde adequado e que ofereça um bom custo-benefício, ou se serviços de saúde privados estão sendo utilizados de forma desnecessária.\n\n7. **Transporte:**\n   - As despesas com transporte são modestas, mas continue monitorando para avaliar se pode usar transporte público ou outras opções mais econômicas.\n\n### **Conclusão:**\n\nA situação financeira apresentada sugere que você está no caminho certo com um saldo positivo. No entanto, para garantir um futuro financeiro mais seguro, é fundamental melhorar a categorização e o controle das suas despesas. A criação de um orçamento e a acumulação de um fundo de emergência serão passos críticos na direção de uma vida financeira mais saudável.';

export const generateAiReport = async ({ month }: GenerateAiReportSchema) => {
  generateAiReportSchema.parse({ month });

  // verificar se o usuário esta logado
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  // verificar se o usuário tem um plano premium
  const user = (await clerkClient()).users.getUser(userId);
  const hasPremiumPlan =
    (await user).publicMetadata.subscriptionPlan === "premium";
  if (!hasPremiumPlan) {
    throw new Error("You need a premium plan to generate AI reports");
  }

  // verificar se a chave da API do OpenAI esta configurada, se não chamar o relatório dummy teste
  if (!process.env.OPENAI_API_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return DUMMY_REPORT;
  }

  // instanciar o OpenAI SDK
  const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // pegar as transações do mês recebido
  const transactions = await db.transaction.findMany({
    where: {
      date: {
        gte: new Date(`2025-${month}-01`),
        lt: new Date(`2025-${month}-31`),
      },
    },
  });

  // mandar as transações para o ChatGPT e pedir para ele gerar um relatório com insights
  const content = `Gere um relatório com insights sobre as minhas finanças, com dicas e orientações de como melhorar minha vida financeira. As transações estão divididas por ponto e vírgula. A estrutura de cada uma é {DATA}-{TIPO}-{VALOR}-{CATEGORIA}. São elas:
  ${transactions
    .map(
      (transaction) =>
        `${transaction.date.toLocaleDateString("pt-BR")}-R$${transaction.amount}-${transaction.type}-${transaction.category}`,
    )
    .join(";")}`;

  // utilizando a API de completions do OpenAI para gerar um relatório
  const completion = await openAi.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em gestão e organização de finanças pessoais. Você ajuda as pessoas a organizarem melhor as suas finanças.",
      },
      {
        role: "user",
        content,
      },
    ],
  });
  // pegar o relatório gerado pelo ChatGPT e retornar para o usuário
  return completion.choices[0].message.content;
};
