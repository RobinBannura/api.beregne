import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

type ScheduleEntry = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
};

export default function AmortizationTable({ 
  schedule 
}: { 
  schedule: ScheduleEntry[] 
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Måned</TableHead>
            <TableHead>Betaling</TableHead>
            <TableHead>Avdrag</TableHead>
            <TableHead>Renter</TableHead>
            <TableHead>Gjenstående</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedule.slice(0, 12).map((entry) => (
            <TableRow key={entry.month}>
              <TableCell>{entry.month}</TableCell>
              <TableCell>{formatCurrency(entry.payment)}</TableCell>
              <TableCell>{formatCurrency(entry.principal)}</TableCell>
              <TableCell>{formatCurrency(entry.interest)}</TableCell>
              <TableCell>{formatCurrency(entry.remainingBalance)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
