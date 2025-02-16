import type { Express } from "express";
import { createServer } from "http";
import { loanFormSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express) {
  app.post("/api/calculate", async (req, res) => {
    try {
      const data = loanFormSchema.parse(req.body);
      
      // Calculate monthly payment using the formula:
      // P = L[c(1 + c)^n]/[(1 + c)^n - 1]
      // where:
      // P = Monthly Payment
      // L = Loan Amount
      // c = Monthly Interest Rate (annual rate / 12)
      // n = Total Number of Months (years * 12)
      
      const monthlyRate = (data.interestRate / 100) / 12;
      const totalMonths = data.loanTerm * 12;
      
      const monthlyPayment = data.loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
        
      const totalPayment = monthlyPayment * totalMonths;

      // Generate amortization schedule
      const schedule = [];
      let remainingBalance = data.loanAmount;
      
      for (let month = 1; month <= totalMonths && schedule.length < 360; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance = remainingBalance - principalPayment;
        
        schedule.push({
          month,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          remainingBalance: Math.max(0, remainingBalance)
        });
      }

      res.json({
        monthlyPayment,
        totalPayment,
        schedule
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "En feil oppstod under beregningen" });
      }
    }
  });

  return createServer(app);
}
