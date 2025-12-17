import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type HeaderConfig = {
  icon?: React.ComponentType<any>;
  title?: string;
  description?: string;
};

export type BudgetConfig = {
  icon?: React.ComponentType<any>;
  label?: string;
  value?: string | number;
};

export type FieldDef = {
  field: string;
  label?: string;
  type?: string;
  placeholder?: string;
  options?: any[];
  require?: boolean;
};

export type FormSection = {
  title?: string;
  description?: string;
  type?: string; // 'basic' | 'item' | custom
  values?: any;
  fields?: FieldDef[];
  renderField?: (field: FieldDef, values: any, onChange: (field: string, value: any) => void) => React.ReactNode;
  addButtonText?: string;
};

export type ItemsConfig = {
  title?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  quantityField?: string;
  totalLabel?: string;
  columns?: Array<{
    header?: string;
    field?: string;
    className?: string;
    cellClassName?: string;
    render?: (item: any, index?: number) => React.ReactNode;
  }>;
};

export interface FormLayoutProps {
  headerConfig?: HeaderConfig;
  budgetConfig?: BudgetConfig;
  formSections?: FormSection[];
  itemsConfig?: ItemsConfig;
  currentItem?: any;
  items?: any[];
  onBasicInfoChange?: (field: string, value: any) => void;
  onCurrentItemChange?: (field: string, value: any) => void;
  onAddItem?: () => void;
  onEditItem?: (item: any) => void;
  onDeleteItem?: (id: any) => void;
  onSaveDraft?: () => void;
  onSubmit?: (isDraft?: boolean) => void;
  errors?: any;
  loading?: boolean;
  canAddItem?: boolean;
}

export default function FormLayout({
  headerConfig,
  budgetConfig,
  formSections = [],
  itemsConfig,
  currentItem = {},
  items = [],
  onBasicInfoChange,
  onCurrentItemChange,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onSaveDraft,
  onSubmit,
  errors = {},
  loading = false,
  canAddItem = false,
}: FormLayoutProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="flex items-start gap-6 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {headerConfig?.icon && (
              <headerConfig.icon className="h-6 w-6" />
            )}
            <div>
              <h2 className="text-2xl font-semibold">{headerConfig?.title}</h2>
              {headerConfig?.description && (
                <p className="text-sm text-muted-foreground">{headerConfig.description}</p>
              )}
            </div>
          </div>
        </div>

        {budgetConfig && (
          <div className="w-56">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{budgetConfig.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">{budgetConfig.label}</div>
                  <div className="font-semibold">{budgetConfig.value}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <form className="space-y-6">
        {/* Render sections */}
        {formSections.map((section, sidx) => (
          <Card key={sidx}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {section.description && (
                <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(section.fields) &&
                  section.fields.map((field) => (
                    <div key={field.field}>
                      {section.renderField
                        ? section.renderField(field, section.values || {},
                            section.type === "basic"
                              ? onBasicInfoChange || (() => {})
                              : onCurrentItemChange || (() => {}))
                        : null}
                    </div>
                  ))}

                {/* If it's an item section, show add button */}
                {section.type === "item" && (
                  <div className="col-span-full pt-2">
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        type="button"
                        onClick={onAddItem}
                        disabled={!canAddItem}
                      >
                        {section.addButtonText || "Add Item"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Items summary/table */}
        {itemsConfig && (
          <Card>
            <CardHeader>
              <CardTitle>{itemsConfig.title || "Items"}</CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(items) && items.length === 0 ? (
                <div className="text-sm text-muted-foreground">{itemsConfig.emptyDescription}</div>
              ) : (
                <div className="rounded-md border overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {itemsConfig.columns?.map((col, idx) => (
                          <TableHead key={idx} className={col.className}>{col.header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, idx) => (
                        <TableRow key={item.id || idx}>
                          {itemsConfig.columns?.map((col, cidx) => (
                            <TableCell key={cidx} className={col.cellClassName}>
                              {col.render ? col.render(item, idx) : (item[col.field || ""] ?? "-")}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}

                      {/* summary row if quantity field present */}
                      <TableRow>
                        <TableCell colSpan={Math.max(0, (itemsConfig.columns?.length || 1) - 2)} />
                        <TableCell className="text-right font-bold">{itemsConfig.totalLabel || "Total"}</TableCell>
                        {/* <TableCell className="text-right font-bold">
                          {typeof itemsConfig.quantityField === "string"
                            ? items.reduce((sum, it) => sum + (Number(it[itemsConfig?.quantityField]||0) || 0), 0)
                            : "-"}
                        </TableCell> */}
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onSaveDraft?.()} disabled={loading}>
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={() => onSubmit?.(false)}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            {errors?.items && <span className="text-destructive">{errors.items}</span>}
          </div>
        </div>
      </form>
    </div>
  );
}
