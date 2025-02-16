import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { loanFormSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import AmortizationTable from "./amortization-table";
import { useToast } from "@/hooks/use-toast";

type CalculationResult = {
  monthlyPayment: number;
  totalPayment: number;
  schedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }>;
};

type FormValues = {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
};

export default function LoanCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      loanAmount: 3000000,
      interestRate: 4.5,
      loanTerm: 25,
    },
  });

  const { mutate: calculate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiRequest("POST", "/api/calculate", values);
      const data = await res.json();
      return data as CalculationResult;
    },
    onSuccess: (data: CalculationResult) => {
      setResult(data);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Feil",
        description: error.message,
      });
    },
  });

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => calculate(data))} className="space-y-6">
          <FormField
            control={form.control}
            name="loanAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lånebeløp (NOK)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rente (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loanTerm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nedbetalingstid (år)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Beregner..." : "Beregn månedlig betaling"}
          </Button>
        </form>
      </Form>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Månedlig betaling</h3>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(result.monthlyPayment)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Totalt å betale</h3>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(result.totalPayment)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <AmortizationTable schedule={result.schedule} />
        </div>
      )}
    </div>
  );
}