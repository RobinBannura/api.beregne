import LoanCalculator from "@/components/loan-calculator";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">
        Boliglånskalkulator
      </h1>
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <LoanCalculator />
        </CardContent>
      </Card>
    </div>
  );
}
