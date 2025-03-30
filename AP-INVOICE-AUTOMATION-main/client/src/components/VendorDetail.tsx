import { Mail, MapPin, FileText, DollarSign, Calendar, TrendingUp, ArrowUpCircle, ArrowDownCircle, Building2, Filter, PieChart, BarChart3, Clock, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface VendorDetails {
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

interface InvoicesByMonth {
  [key: string]: {
    invoices: Invoice[];
    totalAmount: number;
    count: number;
  };
}

interface VendorDetailProps {
  vendor: VendorDetails;
  invoices: Invoice[] | undefined;
  isLoading?: boolean;
}

export function VendorDetail({ vendor, invoices, isLoading }: VendorDetailProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'paid' | 'pending' | 'error'>('all');
  
  // Group invoices by month and calculate statistics
  const invoicesByMonth: InvoicesByMonth = {};
  
  if (invoices && invoices.length > 0) {
    invoices.forEach((invoice) => {
      const date = new Date(invoice.invoice_header.invoice_date);
      const monthKey = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      
      if (!invoicesByMonth[monthKey]) {
        invoicesByMonth[monthKey] = {
          invoices: [],
          totalAmount: 0,
          count: 0
        };
      }
      
      invoicesByMonth[monthKey].invoices.push(invoice);
      invoicesByMonth[monthKey].totalAmount += invoice.invoice_header.to_usd || invoice.invoice_header.invoice_amount;
      invoicesByMonth[monthKey].count += 1;
    });
  }

  // Calculate additional analytics
  const analytics = {
    totalInvoices: invoices?.length || 0,
    averageInvoiceAmount: invoices && invoices.length > 0 
      ? invoices.reduce((sum, inv) => sum + (inv.invoice_header.to_usd || inv.invoice_header.invoice_amount), 0) / invoices.length 
      : 0,
    paymentStatusDistribution: {
      paid: invoices?.filter(inv => inv.invoice_header.payment_term === 'Immediate').length || 0,
      pending: invoices?.filter(inv => inv.invoice_header.payment_term !== 'Immediate').length || 0,
      error: invoices?.filter(inv => inv.invoice_header.payment_term === 'Error').length || 0
    },
    currencyDistribution: invoices?.reduce((acc, inv) => {
      const currency = inv.invoice_header.currency_code;
      acc[currency] = (acc[currency] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},
    paymentTimeDistribution: invoices?.reduce((acc, inv) => {
      const days = Math.ceil((new Date(inv.invoice_header.invoice_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (days <= 30) acc['0-30'] = (acc['0-30'] || 0) + 1;
      else if (days <= 60) acc['31-60'] = (acc['31-60'] || 0) + 1;
      else acc['60+'] = (acc['60+'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},
    dueDateDistribution: invoices?.reduce((acc, inv) => {
      const dueDate = new Date(inv.invoice_header.invoice_date);
      const today = new Date();
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue < 0) acc['Overdue'] = (acc['Overdue'] || 0) + 1;
      else if (daysUntilDue <= 7) acc['Due in 7 days'] = (acc['Due in 7 days'] || 0) + 1;
      else if (daysUntilDue <= 30) acc['Due in 30 days'] = (acc['Due in 30 days'] || 0) + 1;
      else acc['Due in 30+ days'] = (acc['Due in 30+ days'] || 0) + 1;
      
      return acc;
    }, {} as Record<string, number>) || {}
  };

  // Sort months in descending order
  const sortedMonths = Object.keys(invoicesByMonth).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });

  // Filter invoices based on status
  const filteredInvoices = invoices?.filter(invoice => {
    if (activeFilter === 'all') return true;
    return invoice.invoice_header.payment_term === activeFilter;
  });

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="space-y-6">
        {/* Vendor Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{vendor.vendor_name}</h2>
            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
              {vendor.email && (
                <div className="flex items-center">
                  <Mail className="mr-1 h-4 w-4" />
                  {vendor.email}
                </div>
              )}
              {vendor.address && (
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {vendor.address}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">Total Invoices</div>
              <FileText className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">{vendor.total_invoices}</div>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">Total Amount</div>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">
              {formatCurrency(vendor.total_amount_usd)}
            </div>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">Last Invoice</div>
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">
              {new Date(vendor.last_invoice_date).toLocaleDateString()}
            </div>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">Currencies</div>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">
              {vendor.currencies.join(', ')}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Payment Status Distribution */}
          <div className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Payment Status</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Paid</span>
                <span className="font-medium text-green-600">
                  {analytics.paymentStatusDistribution.paid} ({((analytics.paymentStatusDistribution.paid / analytics.totalInvoices) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Pending</span>
                <span className="font-medium text-yellow-600">
                  {analytics.paymentStatusDistribution.pending} ({((analytics.paymentStatusDistribution.pending / analytics.totalInvoices) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Error</span>
                <span className="font-medium text-red-600">
                  {analytics.paymentStatusDistribution.error} ({((analytics.paymentStatusDistribution.error / analytics.totalInvoices) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Due Date Distribution */}
          <div className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Due Date Distribution</h3>
              <AlertCircle className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              {Object.entries(analytics.dueDateDistribution).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{status}</span>
                  <span className={`font-medium ${
                    status === 'Overdue' ? 'text-red-600' :
                    status === 'Due in 7 days' ? 'text-orange-600' :
                    status === 'Due in 30 days' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {count} ({((count / analytics.totalInvoices) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Currency Distribution */}
          <div className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Currency Distribution</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              {Object.entries(analytics.currencyDistribution).map(([currency, count]) => (
                <div key={currency} className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{currency}</span>
                  <span className="font-medium text-gray-900">
                    {count} ({((count / analytics.totalInvoices) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Average Invoice Amount */}
          <div className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Average Invoice Amount</h3>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              {formatCurrency(analytics.averageInvoiceAmount)}
            </div>
          </div>
        </div>

        {/* Invoice List */}
        <div className="rounded-lg border bg-white">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Vendor Invoices</h3>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value as any)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm"
                >
                  <option value="all">All</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>
          </div>
          <div className="divide-y">
            {sortedMonths.map((month) => (
              <div key={month} className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{month}</h4>
                  <div className="text-sm text-gray-500">
                    {invoicesByMonth[month].count} invoices • {formatCurrency(invoicesByMonth[month].totalAmount)}
                  </div>
                </div>
                <div className="space-y-2">
                  {invoicesByMonth[month].invoices
                    .filter(invoice => activeFilter === 'all' || invoice.invoice_header.payment_term === activeFilter)
                    .map((invoice) => (
                      <div
                        key={invoice.invoice_header.invoice_num}
                        className="flex items-center justify-between rounded-lg border bg-gray-50 p-3"
                      >
                        <div className="flex items-center space-x-3">
                          {invoice.invoice_header.payment_term === 'Immediate' ? (
                            <ArrowUpCircle className="h-5 w-5 text-green-500" />
                          ) : invoice.invoice_header.payment_term !== 'Immediate' ? (
                            <ArrowDownCircle className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <ArrowDownCircle className="h-5 w-5 text-red-500" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">Invoice #{invoice.invoice_header.invoice_num}</div>
                            <div className="text-sm text-gray-500">{invoice.invoice_header.invoice_type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{formatCurrency(invoice.invoice_header.to_usd || invoice.invoice_header.invoice_amount)}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(invoice.invoice_header.invoice_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
            {(!invoices || invoices.length === 0) && (
              <div className="p-4 text-center text-gray-500">No invoices found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 