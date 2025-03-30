import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Currency Settings
  const [defaultCurrency, setDefaultCurrency] = useState("INR");
  const [exchangeRateUpdateFrequency, setExchangeRateUpdateFrequency] = useState("daily");
  const [customExchangeRates, setCustomExchangeRates] = useState({
    USD: "83.00",
    EUR: "89.70",
    GBP: "104.50"
  });

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notifyOnNewInvoice, setNotifyOnNewInvoice] = useState(true);
  const [notifyOnDueDate, setNotifyOnDueDate] = useState(true);
  const [dueDateReminderDays, setDueDateReminderDays] = useState("7");

  // Auto Processing Settings
  const [autoProcessInvoices, setAutoProcessInvoices] = useState(true);
  const [autoUpdateExchangeRates, setAutoUpdateExchangeRates] = useState(true);

  // PDF Processing Settings
  const [ocrEnabled, setOcrEnabled] = useState(true);
  const [ocrLanguage, setOcrLanguage] = useState("en");
  const [pdfStorageDays, setPdfStorageDays] = useState("90");

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    
    toast({
      title: "Settings saved",
      description: "Your settings have been successfully updated.",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      {/* Currency Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Currency Settings</CardTitle>
          <CardDescription>Configure how currencies and exchange rates are handled</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Currency</Label>
              <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Exchange Rate Updates</Label>
              <Select value={exchangeRateUpdateFrequency} onValueChange={setExchangeRateUpdateFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Every Hour</SelectItem>
                  <SelectItem value="daily">Once Daily</SelectItem>
                  <SelectItem value="weekly">Once Weekly</SelectItem>
                  <SelectItem value="manual">Manual Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Custom Exchange Rates (to INR)</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>USD</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={customExchangeRates.USD}
                  onChange={(e) => setCustomExchangeRates(prev => ({ ...prev, USD: e.target.value }))}
                />
              </div>
              <div>
                <Label>EUR</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={customExchangeRates.EUR}
                  onChange={(e) => setCustomExchangeRates(prev => ({ ...prev, EUR: e.target.value }))}
                />
              </div>
              <div>
                <Label>GBP</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={customExchangeRates.GBP}
                  onChange={(e) => setCustomExchangeRates(prev => ({ ...prev, GBP: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how and when you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive important updates via email</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>New Invoice Alerts</Label>
              <p className="text-sm text-gray-500">Get notified when new invoices are received</p>
            </div>
            <Switch checked={notifyOnNewInvoice} onCheckedChange={setNotifyOnNewInvoice} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Due Date Reminders</Label>
              <p className="text-sm text-gray-500">Get notified before invoice due dates</p>
            </div>
            <Switch checked={notifyOnDueDate} onCheckedChange={setNotifyOnDueDate} />
          </div>
          
          <div className="space-y-2">
            <Label>Reminder Days Before Due Date</Label>
            <Select value={dueDateReminderDays} onValueChange={setDueDateReminderDays}>
              <SelectTrigger>
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 days before</SelectItem>
                <SelectItem value="7">7 days before</SelectItem>
                <SelectItem value="14">14 days before</SelectItem>
                <SelectItem value="30">30 days before</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Auto Processing Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Settings</CardTitle>
          <CardDescription>Configure automatic processing features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Automatic Invoice Processing</Label>
              <p className="text-sm text-gray-500">Automatically process and categorize new invoices</p>
            </div>
            <Switch checked={autoProcessInvoices} onCheckedChange={setAutoProcessInvoices} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Automatic Exchange Rate Updates</Label>
              <p className="text-sm text-gray-500">Keep exchange rates updated automatically</p>
            </div>
            <Switch checked={autoUpdateExchangeRates} onCheckedChange={setAutoUpdateExchangeRates} />
          </div>
        </CardContent>
      </Card>

      {/* PDF Processing Settings */}
      <Card>
        <CardHeader>
          <CardTitle>PDF Processing Settings</CardTitle>
          <CardDescription>Configure how PDF invoices are processed and stored</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>OCR Processing</Label>
              <p className="text-sm text-gray-500">Enable automatic text extraction from PDFs</p>
            </div>
            <Switch checked={ocrEnabled} onCheckedChange={setOcrEnabled} />
          </div>
          
          <div className="space-y-2">
            <Label>OCR Language</Label>
            <Select value={ocrLanguage} onValueChange={setOcrLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="multi">Multi-language</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>PDF Storage Duration</Label>
            <Select value={pdfStorageDays} onValueChange={setPdfStorageDays}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 