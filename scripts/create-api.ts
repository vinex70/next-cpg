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
 * - GET    → Fetch data
 * - POST   → Create new resource
 * - PUT    → Update existing resource
 * - DELETE → Remove resource
 * 
 * 📌 Tips:
 * - Gunakan try-catch untuk error handling
 * - Return JSON dengan status code yang sesuai
 * - Validasi input dengan Zod/Joi jika perlu
 * - Untuk auth, cek session/token di middleware
 */

// 🔥 Request Body Type (untuk POST/PUT)
export type ${typeName}RequestBody = {
  // Tambah field sesuai kebutuhan
  id?: string;
  name?: string;
};

// 🔥 Response Type
export type ${typeName}Response = {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
};

/**
 * Main handler untuk ${routePath}
 */
export default async function ${handlerName}Handler(
  req: NextApiRequest,
  res: NextApiResponse<${typeName}Response>
) {
  const { method } = req;

  try {
    switch (method) {
      
      // ─────────────────────────────────────
      // 📥 GET: Fetch data
      // ─────────────────────────────────────
      case "GET": {
        // Contoh: ambil query params
        // const { id } = req.query;
        
        // 🔥 TODO: Implement logic fetch data
        const data = []; // Ganti dengan query ke database
        
        return res.status(200).json({
          success: true,
          data,
          message: "Data berhasil diambil",
        });
      }

      // ─────────────────────────────────────
      // 📤 POST: Create new resource
      // ─────────────────────────────────────
      case "POST": {
        const body: ${typeName}RequestBody = req.body;
        
        // 🔥 TODO: Validasi input
        // if (!body.name) {
        //   return res.status(400).json({
        //     success: false,
        //     error: "Nama wajib diisi",
        //   });
        // }
        
        // 🔥 TODO: Implement logic create
        const newData = { id: "new-id", ...body };
        
        return res.status(201).json({
          success: true,
          data: newData,
          message: "Data berhasil dibuat",
        });
      }

      // ─────────────────────────────────────
      // ✏️ PUT: Update resource
      // ─────────────────────────────────────
      case "PUT": {
        const body: ${typeName}RequestBody = req.body;
        
        // 🔥 TODO: Implement logic update
        // const updated = await db.update({ id: body.id, ...body });
        
        return res.status(200).json({
          success: true,
          data: body,
          message: "Data berhasil diperbarui",
        });
      }

      // ─────────────────────────────────────
      // 🗑️ DELETE: Remove resource
      // ─────────────────────────────────────
      case "DELETE": {
        const { id } = req.query;
        
        // 🔥 TODO: Implement logic delete
        // await db.delete({ id });
        
        return res.status(200).json({
          success: true,
          message: "Data berhasil dihapus",
        });
      }

      // ─────────────────────────────────────
      // ❌ Method not allowed
      // ─────────────────────────────────────
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).json({
          success: false,
          error: \`Method \${method} not allowed\`,
        });
    }
  } catch (error: any) {
    console.error(\`[ERROR] \${routePath}:\`, error);
    
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
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