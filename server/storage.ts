import { loanCalculations, type LoanCalculation, type InsertLoanCalculation } from "@shared/schema";

export interface IStorage {
  saveLoanCalculation(calc: InsertLoanCalculation & { monthlyPayment: number; totalPayment: number }): Promise<LoanCalculation>;
  getCalculationHistory(): Promise<LoanCalculation[]>;
}

export class MemStorage implements IStorage {
  private calculations: Map<number, LoanCalculation>;
  private currentId: number;

  constructor() {
    this.calculations = new Map();
    this.currentId = 1;
  }

  async saveLoanCalculation(calc: InsertLoanCalculation & { monthlyPayment: number; totalPayment: number }): Promise<LoanCalculation> {
    const id = this.currentId++;
    const calculation = {
      id,
      loanAmount: calc.loanAmount.toString(),
      interestRate: calc.interestRate.toString(),
      loanTerm: calc.loanTerm,
      monthlyPayment: calc.monthlyPayment.toString(),
      totalPayment: calc.totalPayment.toString()
    };
    this.calculations.set(id, calculation);
    return calculation;
  }

  async getCalculationHistory(): Promise<LoanCalculation[]> {
    return Array.from(this.calculations.values());
  }
}

export const storage = new MemStorage();