// File: src/type/filterdetailstruk.ts
import { z } from "zod";

// Skema validasi filter menggunakan Zod
export const FilterDetailStrukSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    noMember: z.union([z.string(), z.array(z.string())]).optional(),
    namaMember: z.string().optional(),
    div: z.string().optional(),
    dept: z.string().optional(),
    kat: z.string().optional(),
    tag: z.string().optional(),
    prdcd: z.union([z.string(), z.array(z.string())]).optional(),
    prdcdGrup: z.array(z.string()).optional(),
    namaBarang: z.string().optional(),
    barcode: z.string().optional(),
    nonTunai: z.enum(["true", "false"]).optional(),
    struk: z.union([z.string(), z.array(z.string())]).optional(),
    memberKhusus: z.string().optional(),
    outlet: z.string().optional(),
    subOutlet: z.string().optional(),
    cashback: z.array(z.string()).optional(),
    cbAktif: z.string().optional(),
    cbUc: z.string().optional(),
    cbredempoin: z.string().optional(),
    gift: z.string().optional(),
    promo: z.array(z.string()).optional(),
    kasir: z.union([z.string(), z.array(z.string())]).optional(),
    kasirType: z.enum(["non-kss", "only-kss"]).optional(),
    methodType: z.enum(["kum", "virtual"]).optional(),
    pluLarangan: z.enum(["non-larangan", "larangan"]).optional(),
    kode_supplier: z.union([z.string(), z.array(z.string())]).optional(),
    namaSupplier: z.string().optional(),
    monitoringSupplier: z.string().optional(),
    strukSupplier: z.string().optional(),
    selectedReport: z.string().optional(),
});

export type FilterDetailStrukInput = z.infer<typeof FilterDetailStrukSchema>;
