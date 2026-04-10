// scripts/create-api.ts
import fs from "fs";
import path from "path";

const apiName = process.argv[2];

// ─────────────────────────────────────────────
// 🔐 VALIDASI: Hanya terima kebab-case + nested path
// ─────────────────────────────────────────────
const isValidKebabCase = (str: string): boolean => {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
};

if (!apiName) {
  console.error("❌ Masukkan nama API endpoint (contoh: users atau laporan/harian/penjualan)");
  console.error("   ⚠️  WAJIB kebab-case: huruf kecil, angka, dan dash (-) saja");
  console.error("   Format: npm run create:api <path/nama-endpoint>");
  process.exit(1);
}

// ─────────────────────────────────────────────
// 🔧 HELPERS: Konversi ke format TypeScript
// ─────────────────────────────────────────────

// Kebab-case → PascalCase (untuk Type): "penjualan-aktif" → "PenjualanAktif"
const toPascalCase = (str: string): string => {
  return str
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

// Kebab-case → camelCase (untuk Variable): "penjualan-aktif" → "penjualanAktif"
const toCamelCase = (str: string): string => {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

// ─────────────────────────────────────────────
// 🧩 PROSES INPUT
// ─────────────────────────────────────────────
const parts = apiName.split("/");
const rawFileName = parts.pop()!; // "penjualan-aktif"
const folders = parts;            // ["laporan", "harian"]

// 🔐 Validasi nama file HARUS kebab-case
if (!isValidKebabCase(rawFileName)) {
  console.error(`❌ Nama API tidak valid: "${rawFileName}"`);
  console.error("   ✅ Gunakan kebab-case: huruf kecil, angka, dash (-)");
  console.error("   📌 Contoh valid:");
  console.error("      - users");
  console.error("      - laporan-penjualan");
  console.error("      - auth/login");
  console.error("   🚫 Contoh invalid:");
  console.error("      - Users (PascalCase)");
  console.error("      - laporan_penjualan (snake_case)");
  console.error("      - loginUsers (camelCase)");
  process.exit(1);
}

// 🔐 Validasi folder (jika ada) juga harus kebab-case
for (const folder of folders) {
  if (folder && !isValidKebabCase(folder)) {
    console.error(`❌ Nama folder tidak valid: "${folder}"`);
    console.error("   ✅ Folder juga harus kebab-case (huruf kecil + dash)");
    process.exit(1);
  }
}

// ─────────────────────────────────────────────
// 📁 BUILD PATH (Next.js Pages Router API)
// ─────────────────────────────────────────────
const baseDir = path.join(process.cwd(), "src", "pages", "api", ...folders);
const filePath = path.join(baseDir, `${rawFileName}.ts`);

// 🔐 Cek jika file sudah ada
if (fs.existsSync(filePath)) {
  console.error(`❌ API route sudah ada: ${filePath}`);
  process.exit(1);
}

// ─────────────────────────────────────────────
// 🏷️ NAMING UNTUK TYPESCRIPT
// ─────────────────────────────────────────────
const typeName = toPascalCase(rawFileName);        // PenjualanAktif
const handlerName = toCamelCase(rawFileName);      // penjualanAktif
const routePath = `/api/${apiName}`;               // /api/laporan/harian/penjualan-aktif

// ─────────────────────────────────────────────
// 📝 TEMPLATE (Next.js API Route Handler)
// ─────────────────────────────────────────────
const template = `import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

/**
 * =========================================
 * 🔌 API ROUTE: ${typeName}
 * =========================================
 * 
 * 📍 Endpoint: ${routePath}
 * 📄 File: src/pages/api/${apiName}.ts
 * 🧩 Handler: ${handlerName}Handler
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
type ${typeName} = {
  // contoh:
  id?: string;
};

/**
 * Main handler untuk ${routePath}
 */
export default async function ${handlerName}Handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<${typeName}[]>>
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
    const query = \`
      SELECT *
      FROM your_table
      LIMIT 10
    \`;

    const result = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("[ERROR] ${routePath}:", error);

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
`;

// ─────────────────────────────────────────────
// 🚀 EKSEKUSI: Buat folder + tulis file
// ─────────────────────────────────────────────
fs.mkdirSync(baseDir, { recursive: true });
fs.writeFileSync(filePath, template);

console.log(`✅ API route berhasil dibuat:`);
console.log(`   📄 File        : ${filePath}`);
console.log(`   🔌 Endpoint    : ${routePath}`);
console.log(`   🧩 Handler     : ${handlerName}Handler`);
console.log(`   🏷️  Type       : ${typeName}RequestBody / ${typeName}Response`);
console.log(`   🗂️  Folder      : ${folders.length > 0 ? folders.join("/") : "(root api)"}`);
console.log(``);
console.log(`💡 Cara test:`);
console.log(`   curl http://localhost:5000${routePath}`);
console.log(`   curl -X POST http://localhost:5000${routePath} -H "Content-Type: application/json" -d '{"name":"test"}'`);