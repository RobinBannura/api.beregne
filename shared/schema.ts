import { pgTable, text, serial, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const loanCalculations = pgTable("loan_calculations", {
  id: serial("id").primaryKey(),
  loanAmount: numeric("loan_amount").notNull(),
  interestRate: numeric("interest_rate").notNull(),
  loanTerm: integer("loan_term").notNull(), // in years
  monthlyPayment: numeric("monthly_payment").notNull(),
  totalPayment: numeric("total_payment").notNull(),
});

export const calculationSchema = createInsertSchema(loanCalculations).pick({
  loanAmount: true,
  interestRate: true,
  loanTerm: true,
});

export type LoanCalculation = typeof loanCalculations.$inferSelect;
export type InsertLoanCalculation = z.infer<typeof calculationSchema>;

export const loanFormSchema = calculationSchema.extend({
  loanAmount: z.number().min(1, "Lånebeløp må være større enn 0"),
  interestRate: z.number().min(0.1, "Rente må være større enn 0.1%").max(100, "Rente må være mindre enn 100%"),
  loanTerm: z.number().min(1, "Nedbetalingstid må være minst 1 år").max(40, "Nedbetalingstid kan ikke være mer enn 40 år"),
});
