// src/pages/api/select-outlet-member.ts
import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const query = `
            SELECT
                out_kodeoutlet,
                out_namaoutlet
            FROM
                tbmaster_outlet
        `;

        const result = await pool.query(query);
        return res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error("Error fetching outlet members:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });

    }
}