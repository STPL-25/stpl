import { useState } from 'react';
import { ChevronDown, ChevronRight, Mail, Phone, Building2, MapPin, CreditCard, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface KYCData {
  kyc_basic_info_sno: number[];
  company_name: string;
  contact_person: string;
  email: string;
  mobile_number: string;
  business_type: string;
  is_gst_avail: string;
  gst_no: string;
  is_msme_avail: string;
  msme_no: string | null;
  pan_no: string;
  status: string;
  created_date: string;
  kyc_address: string;
  kyc_bank_info: string;
  kyc_contact_details: string;
  kyc_uploaded_doc: string;
}

interface APIResponse {
  success: boolean;
  data: KYCData[];
  count: number;
}

const KYCSupplierView = ({ apiData }: { apiData: APIResponse }) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const parseJSONField = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return [];
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">KYC Supplier Management</h1>
          <p className="text-muted-foreground">Total Suppliers: {apiData.count}</p>
        </div>
      </div>

      <div className="space-y-4">
        {apiData.data.map((supplier, index) => {
          const isExpanded = expandedRows.has(index);
          const addresses = parseJSONField(supplier.kyc_address);
          const bankInfo = parseJSONField(supplier.kyc_bank_info);
          const contacts = parseJSONField(supplier.kyc_contact_details);
          const documents = parseJSONField(supplier.kyc_uploaded_doc);

          return (
            <Card key={index} className="overflow-hidden">
              <Collapsible open={isExpanded} onOpenChange={() => toggleRow(index)}>
                <div className="flex items-center justify-between p-6 hover:bg-accent/50 cursor-pointer" onClick={() => toggleRow(index)}>
                  <div className="flex items-center gap-4 flex-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{supplier.company_name}</h3>
                        <Badge variant={supplier.status === 'Y' ? 'default' : 'secondary'}>
                          {supplier.status === 'Y' ? 'Active' : 'Inactive'}
                        </Badge>
                        {supplier.is_gst_avail === 'Y' && <Badge variant="outline">GST</Badge>}
                        {supplier.is_msme_avail === 'Y' && <Badge variant="outline">MSME</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {supplier.contact_person}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {supplier.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {supplier.mobile_number}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <CollapsibleContent>
                  <div className="border-t px-6 pb-6">
                    <Tabs defaultValue="basic" className="mt-6">
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="address">Address</TabsTrigger>
                        <TabsTrigger value="bank">Bank Details</TabsTrigger>
                        <TabsTrigger value="contacts">Contacts</TabsTrigger>
                        <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <InfoItem label="Business Type" value={supplier.business_type} />
                          <InfoItem label="PAN Number" value={supplier.pan_no} />
                          <InfoItem label="GST Number" value={supplier.gst_no} />
                          <InfoItem label="MSME Number" value={supplier.msme_no || 'N/A'} />
                          <InfoItem label="Created Date" value={new Date(supplier.created_date).toLocaleDateString()} />
                          <InfoItem label="Supplier SNO" value={supplier.kyc_basic_info_sno.join(', ')} />
                        </div>
                      </TabsContent>

                      <TabsContent value="address" className="mt-4">
                        <div className="space-y-4">
                          {addresses.map((addr: any, idx: number) => (
                            <Card key={idx}>
                              <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {addr.address_type === 'PR' ? 'Primary' : addr.address_type} Address
                                  {addr.is_primary === '1' && <Badge variant="secondary">Primary</Badge>}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="grid grid-cols-2 gap-3 text-sm">
                                <InfoItem label="Door No" value={addr.door_no} />
                                <InfoItem label="Street" value={addr.street} />
                                <InfoItem label="Area" value={addr.area} />
                                <InfoItem label="City" value={addr.city} />
                                <InfoItem label="Taluk" value={addr.taluk} />
                                <InfoItem label="State" value={addr.state} />
                                <InfoItem label="Pincode" value={addr.pincode} />
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="bank" className="mt-4">
                        <div className="space-y-4">
                          {bankInfo.map((bank: any, idx: number) => (
                            <Card key={idx}>
                              <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  {bank.bank_name}
                                  {bank.is_primary === 'Y' && <Badge variant="secondary">Primary</Badge>}
                                </CardTitle>
                                <CardDescription>{bank.bank_branch_name}</CardDescription>
                              </CardHeader>
                              <CardContent className="grid grid-cols-2 gap-3 text-sm">
                                <InfoItem label="Account Holder" value={bank.ac_holder_name} />
                                <InfoItem label="Account Number" value={bank.ac_number} />
                                <InfoItem label="Account Type" value={bank.ac_type} />
                                <InfoItem label="IFSC Code" value={bank.ifsc} />
                                <InfoItem label="Bank Address" value={bank.bank_address} className="col-span-2" />
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="contacts" className="mt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Contact Type</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Position</TableHead>
                              <TableHead>Mobile</TableHead>
                              <TableHead>Email</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {contacts.map((contact: any, idx: number) => (
                              <TableRow key={idx}>
                                <TableCell><Badge variant="outline">{contact.contact_type}</Badge></TableCell>
                                <TableCell className="font-medium">{contact.contact_name}</TableCell>
                                <TableCell>{contact.contact_position}</TableCell>
                                <TableCell>{contact.contact_mobile}</TableCell>
                                <TableCell>{contact.contact_email}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>

                      <TabsContent value="documents" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {documents.map((doc: any, idx: number) => (
                            <Card key={idx}>
                              <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                  <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                                  <div className="flex-1 space-y-2">
                                    <div>
                                      <p className="font-medium">{doc.document_name}</p>
                                      <p className="text-sm text-muted-foreground">{doc.document_type}</p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={doc.document_path} target="_blank" rel="noopener noreferrer">
                                        View Document
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, className = '' }: { label: string; value: any; className?: string }) => (
  <div className={className}>
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default KYCSupplierView;
