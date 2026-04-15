import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

/**
 * =========================================
 * 🔌 API ROUTE: DaftarProduk
 * =========================================
 * 
 * 📍 Endpoint: /api/daftar-produk
 * 📄 File: src/pages/api/daftar-produk.ts
 * 🧩 Handler: daftarProdukHandler
 * 
 * 📌 Supported Methods:
 * - GET → Fetch data
 */

// 🔥 Response Generic Type
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

// 🔥 Data Type (ubah sesuai kebutuhan)
type DaftarProduk = {
  // contoh:
  id?: string;
};

/**
 * Main handler untuk /api/daftar-produk
 */
export default async function daftarProdukHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DaftarProduk[]>>
) {
  // 🔥 hanya GET
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // 🔥 TODO: Ganti query sesuai kebutuhan
    const query = `
        select
          prd_prdcd,
          prd_deskripsipanjang,
          prd_frac||' / '||prd_unit as satuan,
          st_saldoakhir
        from tbmaster_prodmast
        left join tbmaster_stock on prd_prdcd = st_prdcd
        where prd_prdcd like '%0'
        and st_lokasi = '01'
    `;

    const result = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("[ERROR] /api/daftar-produk:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : String(error)
          : undefined,
    });
  }
}
