// pages/api/test-db.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import { DetailStruk } from "@/utils/query/detailStruk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Buat query SQL dari fungsi DetailStruk dengan kondisi kosong (atau kamu bisa pasang filter)
        const query = `SELECT dtl_k_div, sum(dtl_netto) FROM (${DetailStruk("where date_trunc('day', dtl_tanggal) = date_trunc('day', now())")}) as subquery group by dtl_k_div ORDER BY dtl_k_div LIMIT 10`;

        // Jalankan query
        const result = await pool.query(query);

        // Kirim hasilnya ke response
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Database connection failed:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ success: false, message: "DB connection failed", error: errorMessage });
    }
}
