// src/pages/api/select-divisi.ts
import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const query = `
            SELECT
                div_kodedivisi,
                div_namadivisi
            FROM
                tbmaster_divisi
            ORDER BY
                div_kodedivisi
        `;

        const result = await pool.query(query);
        return res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error("Error fetching divisions:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });

    }
}