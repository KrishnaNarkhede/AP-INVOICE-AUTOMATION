import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { VendorList } from "@/components/VendorList";
import { VendorDetail } from "@/components/VendorDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, FileText, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface VendorSummary {
  vendor_name: string;
  email: string;
  address?: string;
  total_invoices: number;
  total_amount_usd: number;
  last_invoice_date: string;
  currencies: string[];
}

interface InvoiceLine {
  line_number: string;
  line_type: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_amount: number;
}

interface InvoiceHeader {
  invoice_num: string;
  invoice_date: string;
  vendor_name: string;
  vendor_site_code: string;
  invoice_amount: number;
  currency_code: string;
  payment_term: string;
  invoice_type: string;
  organization_code: string;
  to_usd: number;
}

interface Invoice {
  invoice_header: InvoiceHeader;
  invoice_lines: InvoiceLine[];
}

interface InvoiceResponse {
  invoices: Invoice[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Transform server invoice data to the format expected by VendorDetail
function transformInvoiceData(invoice: Invoice): {
  id: string;
  date: string;
  amount: number;
  status: string;
  type: string;
} {
  return {
    id: invoice.invoice_header.invoice_num,
    date: invoice.invoice_header.invoice_date,
    amount: invoice.invoice_header.to_usd || invoice.invoice_header.invoice_amount,
    status: invoice.invoice_header.payment_term === 'Immediate' ? 'paid' : 'pending',
    type: invoice.invoice_header.invoice_type
  };
}

function WelcomeSection({ vendors }: { vendors: VendorSummary[] | undefined }) {
  if (!vendors) return null;

  const totalVendors = vendors.length;
  const totalInvoices = vendors.reduce((sum, v) => sum + v.total_invoices, 0);
  const totalAmount = vendors.reduce((sum, v) => sum + v.total_amount_usd, 0);
  const uniqueCurrencies = new Set(vendors.flatMap(v => v.currencies)).size;

  // Calculate month-over-month growth
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const thisMonthInvoices = vendors.filter(v => new Date(v.last_invoice_date) > lastMonth).length;
  const lastMonthInvoices = vendors.filter(v => {
    const date = new Date(v.last_invoice_date);
    return date > new Date(lastMonth.setMonth(lastMonth.getMonth() - 1)) && date <= lastMonth;
  }).length;
  
  const growthRate = lastMonthInvoices > 0 
    ? ((thisMonthInvoices - lastMonthInvoices) / lastMonthInvoices) * 100 
    : 0;

  return (
    <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Vendor Management</h1>
          <p className="text-gray-600">Track and manage all your vendor relationships and invoices in one place.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Total Vendors</span>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">{totalVendors}</div>
          </div>
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Total Invoices</span>
              <FileText className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">{totalInvoices}</div>
          </div>
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Total Amount</span>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">{formatCurrency(totalAmount)}</div>
          </div>
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Currencies</span>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">{uniqueCurrencies}</div>
          </div>
        </div>

        {/* Growth Indicator */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Growth</h2>
            <div className={`flex items-center ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growthRate >= 0 ? (
                <ArrowUpRight className="h-5 w-5 mr-1" />
              ) : (
                <ArrowDownRight className="h-5 w-5 mr-1" />
              )}
              <span className="font-medium">{Math.abs(growthRate).toFixed(1)}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">This Month</span>
              <span className="font-medium text-gray-900">{thisMonthInvoices} invoices</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Last Month</span>
              <span className="font-medium text-gray-900">{lastMonthInvoices} invoices</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Vendors() {
  const [selectedVendor, setSelectedVendor] = useState<string | undefined>();

  const { data: vendors, isLoading: vendorsLoading } = useQuery<VendorSummary[]>({
    queryKey: ["/api/vendors/summary"],
  });

  const { data: invoiceData, isLoading: invoicesLoading } = useQuery<InvoiceResponse>({
    queryKey: ["/api/invoices", { vendor: selectedVendor }],
    enabled: !!selectedVendor,
    select: (data) => ({
      ...data,
      invoices: data.invoices.filter(invoice => 
        invoice.invoice_header.vendor_name === selectedVendor
      )
    })
  });

  if (vendorsLoading) {
    return (
      <div className="h-full flex">
        <div className="w-80 border-r border-gray-200 p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
        <div className="flex-1" />
      </div>
    );
  }

  const selectedVendorData = vendors?.find(v => v.vendor_name === selectedVendor);

  return (
    <div className="h-full flex">
      <VendorList
        vendors={vendors || []}
        selectedVendor={selectedVendor}
        onVendorSelect={setSelectedVendor}
      />
      
      {selectedVendorData ? (
        <VendorDetail
          vendor={selectedVendorData}
          invoices={invoiceData?.invoices}
          isLoading={invoicesLoading}
        />
      ) : (
        <WelcomeSection vendors={vendors} />
      )}
    </div>
  );
} 