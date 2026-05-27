import type { SectorKey, Language } from './types'

export interface ProcessOption {
  key: string
  en: string
  lt: string
}

const OTHER: ProcessOption = { key: 'other', en: 'Other (type your own)', lt: 'Kita (įveskite savo)' }

const MANUFACTURING: ProcessOption[] = [
  { key: 'po_processing',      en: 'Purchase order processing',           lt: 'Pirkimo užsakymų apdorojimas' },
  { key: 'supplier_invoice',   en: 'Supplier invoice matching',            lt: 'Tiekėjų sąskaitų suderinimas' },
  { key: 'prod_planning',      en: 'Production planning & scheduling',     lt: 'Gamybos planavimas ir grafikas' },
  { key: 'qc_logging',         en: 'Quality control logging',              lt: 'Kokybės kontrolės žurnalo pildymas' },
  { key: 'stock_replenish',    en: 'Raw material stock replenishment',     lt: 'Žaliavų atsargų papildymas' },
  { key: 'delivery_note',      en: 'Delivery note / goods receipt',        lt: 'Pristatymo važtaraščių apdorojimas' },
  { key: 'timesheets',         en: 'Employee timesheets & payroll prep',   lt: 'Darbo laiko apskaita ir atlyginimų ruošimas' },
  { key: 'maintenance',        en: 'Maintenance request handling',         lt: 'Techninės priežiūros užklausų tvarkymas' },
  { key: 'order_confirm',      en: 'Customer order confirmation',          lt: 'Klientų užsakymų patvirtinimas' },
  { key: 'vat_reporting',      en: 'VAT / i.SAF / i.MAS reporting',        lt: 'PVM / i.SAF / i.MAS ataskaitų teikimas' },
  OTHER,
]

const LOGISTICS: ProcessOption[] = [
  { key: 'transport_order',    en: 'Transport order creation',             lt: 'Transporto užsakymų kūrimas' },
  { key: 'route_assign',       en: 'Driver route assignment',              lt: 'Maršrutų priskyrimas vairuotojams' },
  { key: 'cmr_docs',           en: 'CMR / waybill document preparation',  lt: 'CMR / važtaraščių ruošimas' },
  { key: 'freight_invoice',    en: 'Freight invoice reconciliation',       lt: 'Krovinių sąskaitų suderinimas' },
  { key: 'customs',            en: 'Customs declaration preparation',      lt: 'Muitinės deklaracijų rengimas' },
  { key: 'pod',                en: 'Proof of delivery collection',         lt: 'Pristatymo patvirtinimų rinkimas' },
  { key: 'vehicle_maint',      en: 'Vehicle maintenance scheduling',       lt: 'Transporto priemonių techninės apžiūros planavimas' },
  { key: 'fuel_tracking',      en: 'Fleet fuel consumption tracking',      lt: 'Degalų sunaudojimo stebėjimas' },
  { key: 'status_notify',      en: 'Client status update notifications',   lt: 'Klientų informavimas apie statusą' },
  { key: 'vat_reporting',      en: 'VAT / i.SAF / i.MAS reporting',        lt: 'PVM / i.SAF / i.MAS ataskaitų teikimas' },
  OTHER,
]

const WHOLESALE: ProcessOption[] = [
  { key: 'sales_order',        en: 'Sales order processing',               lt: 'Pardavimo užsakymų apdorojimas' },
  { key: 'po_supplier',        en: 'Purchase order to supplier',           lt: 'Pirkimo užsakymų tiekėjams siuntimas' },
  { key: 'supplier_invoice',   en: 'Supplier invoice entry & matching',    lt: 'Tiekėjų sąskaitų įvedimas ir suderinimas' },
  { key: 'customer_invoice',   en: 'Customer invoice generation',          lt: 'Klientų sąskaitų generavimas' },
  { key: 'stock_monitor',      en: 'Stock level monitoring & replenishment', lt: 'Atsargų lygio stebėjimas ir papildymas' },
  { key: 'price_list',         en: 'Price list updates',                   lt: 'Kainų sąrašų atnaujinimas' },
  { key: 'returns',            en: 'Returns & credit note processing',     lt: 'Grąžinimų ir kreditinių sąskaitų apdorojimas' },
  { key: 'delivery_sched',     en: 'Delivery scheduling',                  lt: 'Pristatymų planavimas' },
  { key: 'debtor_followup',    en: 'Debtor follow-up (overdue invoices)',  lt: 'Priminimų siuntimas dėl pradelstų sąskaitų' },
  { key: 'vat_reporting',      en: 'VAT / i.SAF reporting',                lt: 'PVM / i.SAF ataskaitų teikimas' },
  OTHER,
]

const SERVICES: ProcessOption[] = [
  { key: 'client_onboard',     en: 'Client onboarding',                   lt: 'Klientų priėmimas ir registracija' },
  { key: 'timesheet_billing',  en: 'Timesheet collection & billing',      lt: 'Darbo laiko apskaita ir sąskaitų išrašymas' },
  { key: 'contract_gen',       en: 'Contract generation & signing',       lt: 'Sutarčių rengimas ir pasirašymas' },
  { key: 'project_report',     en: 'Project status reporting',            lt: 'Projekto eigos ataskaitų rengimas' },
  { key: 'expense_report',     en: 'Expense report processing',           lt: 'Išlaidų ataskaitų apdorojimas' },
  { key: 'meeting_sched',      en: 'Meeting scheduling & reminders',      lt: 'Susitikimų planavimas ir priminimai' },
  { key: 'employee_onboard',   en: 'New employee onboarding',             lt: 'Naujų darbuotojų įvedimas' },
  { key: 'invoice_approval',   en: 'Invoice approval workflow',           lt: 'Sąskaitų tvirtinimo procesas' },
  { key: 'compliance',         en: 'Compliance / regulatory filing',      lt: 'Atitikties / reguliacinių dokumentų teikimas' },
  { key: 'vat_reporting',      en: 'VAT / i.SAF reporting',               lt: 'PVM / i.SAF ataskaitų teikimas' },
  OTHER,
]

const RETAIL: ProcessOption[] = [
  { key: 'stock_replenish',    en: 'Stock replenishment ordering',        lt: 'Atsargų papildymo užsakymai' },
  { key: 'goods_receipt',      en: 'Goods receipt & shelf registration',  lt: 'Prekių priėmimas ir registracija sandėlyje' },
  { key: 'supplier_invoice',   en: 'Supplier invoice processing',         lt: 'Tiekėjų sąskaitų apdorojimas' },
  { key: 'customer_returns',   en: 'Customer returns handling',           lt: 'Klientų grąžinimų tvarkymas' },
  { key: 'price_promo',        en: 'Price & promotion updates',           lt: 'Kainų ir akcijų atnaujinimas' },
  { key: 'sales_report',       en: 'Sales report generation',             lt: 'Pardavimų ataskaitų rengimas' },
  { key: 'cash_reconcile',     en: 'End-of-day cash reconciliation',      lt: 'Dienos pabaigos kasos suderinimas' },
  { key: 'loyalty',            en: 'Loyalty programme management',        lt: 'Lojalumo programos administravimas' },
  { key: 'online_orders',      en: 'Online order fulfilment',             lt: 'Internetinių užsakymų įvykdymas' },
  { key: 'vat_reporting',      en: 'VAT / i.SAF reporting',               lt: 'PVM / i.SAF ataskaitų teikimas' },
  OTHER,
]

const OTHER_SECTOR: ProcessOption[] = [
  { key: 'invoice_proc',       en: 'Invoice processing',                  lt: 'Sąskaitų apdorojimas' },
  { key: 'employee_onboard',   en: 'Employee onboarding',                 lt: 'Darbuotojų priėmimas' },
  { key: 'report_gen',         en: 'Report generation',                   lt: 'Ataskaitų rengimas' },
  { key: 'purchase_approval',  en: 'Purchase approval',                   lt: 'Pirkimų tvirtinimas' },
  { key: 'order_handling',     en: 'Customer order handling',             lt: 'Klientų užsakymų tvarkymas' },
  { key: 'payroll',            en: 'Payroll preparation',                 lt: 'Atlyginimų skaičiavimas' },
  { key: 'contract_mgmt',      en: 'Contract management',                 lt: 'Sutarčių valdymas' },
  { key: 'compliance',         en: 'Regulatory / compliance filing',      lt: 'Reguliacinių dokumentų teikimas' },
  OTHER,
]

export const PROCESS_DROPDOWNS: Record<SectorKey, ProcessOption[]> = {
  manufacturing: MANUFACTURING,
  logistics:     LOGISTICS,
  wholesale:     WHOLESALE,
  services:      SERVICES,
  retail:        RETAIL,
  other:         OTHER_SECTOR,
}

export function getOptionLabel(option: ProcessOption, language: Language): string {
  return language === 'lt' ? option.lt : option.en
}
