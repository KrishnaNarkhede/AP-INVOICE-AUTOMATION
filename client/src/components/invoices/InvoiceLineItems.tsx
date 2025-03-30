import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InvoiceLine } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

interface InvoiceLineItemsProps {
  lines: InvoiceLine[];
  currency: string;
}

export default function InvoiceLineItems({ lines, currency }: InvoiceLineItemsProps) {
  // Calculate total amount including tax
  const totalAmount = lines.reduce((sum, line) => sum + line.line_amount, 0);
  const totalTax = lines.reduce((sum, line) => sum + (line.tax_amount || 0), 0);
  const totalWithTax = totalAmount + totalTax;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Line #</TableHead>
          <TableHead className="w-32">Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="w-24 text-right">Quantity</TableHead>
          <TableHead className="w-32 text-right">Unit Price</TableHead>
          <TableHead className="w-32 text-right">Amount</TableHead>
          <TableHead className="w-32 text-right">Tax</TableHead>
          <TableHead className="w-32 text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lines.map((line) => (
          <TableRow key={line.line_number}>
            <TableCell>{line.line_number}</TableCell>
            <TableCell>{line.line_type}</TableCell>
            <TableCell>{line.description}</TableCell>
            <TableCell className="text-right">{line.quantity}</TableCell>
            <TableCell className="text-right">{formatCurrency(line.unit_price, currency)}</TableCell>
            <TableCell className="text-right">{formatCurrency(line.line_amount, currency)}</TableCell>
            <TableCell className="text-right">{formatCurrency(line.tax_amount || 0, currency)}</TableCell>
            <TableCell className="text-right">{formatCurrency(line.line_amount + (line.tax_amount || 0), currency)}</TableCell>
          </TableRow>
        ))}
        {/* Total Row */}
        <TableRow className="border-t-2">
          <TableCell colSpan={5} className="text-right font-medium">
            Subtotals:
          </TableCell>
          <TableCell className="text-right font-bold">
            {formatCurrency(totalAmount, currency)}
          </TableCell>
          <TableCell className="text-right font-bold">
            {formatCurrency(totalTax, currency)}
          </TableCell>
          <TableCell className="text-right font-bold">
            {formatCurrency(totalWithTax, currency)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
