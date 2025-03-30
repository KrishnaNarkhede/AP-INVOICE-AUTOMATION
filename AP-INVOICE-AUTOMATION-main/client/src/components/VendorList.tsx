import { useState } from "react";
import { ChevronRight, Mail, Search, Building2, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface VendorDetails {
  vendor_name: string;
  email: string;
  address?: string;
  total_invoices: number;
  total_amount_usd: number;
  last_invoice_date: string;
  currencies: string[];
}

interface VendorListProps {
  vendors: VendorDetails[];
  selectedVendor?: string;
  onVendorSelect: (vendorName: string) => void;
}

export function VendorList({ vendors, selectedVendor, onVendorSelect }: VendorListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVendors = vendors.filter(vendor =>
    vendor.vendor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[400px] flex flex-col h-full border-r border-gray-200 bg-gray-50">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Clients</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-auto flex-1">
        <div className="divide-y divide-gray-200">
          {filteredVendors.map((vendor) => (
            <button
              key={vendor.vendor_name}
              onClick={() => onVendorSelect(vendor.vendor_name)}
              className={`w-full text-left p-4 hover:bg-white transition-colors ${
                selectedVendor === vendor.vendor_name ? "bg-white border-l-4 border-blue-500" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">{vendor.vendor_name}</span>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>{vendor.email}</span>
                  </div>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium">{vendor.total_invoices}</span>
                      <span className="ml-1">invoices</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="font-medium">{formatCurrency(vendor.total_amount_usd)}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 mt-2 ${
                  selectedVendor === vendor.vendor_name ? "text-blue-500" : "text-gray-400"
                }`} />
              </div>
            </button>
          ))}
          
          {filteredVendors.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No clients found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 