import { z } from "zod";

export const FilterFormSoHarianSchema = z.object({
    plu: z.string().optional(),
    // Tambahkan fields lain sesuai kebutuhan
});

export type FilterFormSoHarianInput = z.infer<typeof FilterFormSoHarianSchema>;