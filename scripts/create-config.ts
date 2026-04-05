// scripts/create-config.ts
import fs from "fs";
import path from "path";

const input = process.argv[2];

// ─────────────────────────────────────────────
// 🔐 VALIDASI: Hanya terima kebab-case + nested path
// ─────────────────────────────────────────────
const isValidKebabCase = (str: string): boolean => {
    // Pattern: huruf kecil/angka, boleh dipisah dash, tidak boleh dash di awal/akhir
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
};

if (!input) {
    console.error("❌ Masukkan nama config (contoh: per-struk atau laporan/harian/penjualan-aktif)");
    console.error("   ⚠️  WAJIB kebab-case: huruf kecil, angka, dan dash (-) saja");
    console.error("   Format: npm run create:config <path/nama-config>");
    process.exit(1);
}

// ─────────────────────────────────────────────
// 🔧 HELPERS: Konversi ke format TypeScript
// ─────────────────────────────────────────────

// Kebab-case → PascalCase (untuk Type): "test-produk" → "TestProduk"
const toPascalCase = (str: string): string => {
    return str
        .split("-")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
};

// Kebab-case → camelCase (untuk Variable): "test-produk" → "testProduk"
const toCamelCase = (str: string): string => {
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

// ─────────────────────────────────────────────
// 🧩 PROSES INPUT
// ─────────────────────────────────────────────
const parts = input.split("/");
const rawFileName = parts.pop()!; // "test-produk"
const folders = parts;            // ["test"]

// 🔐 Validasi nama file HARUS kebab-case
if (!isValidKebabCase(rawFileName)) {
    console.error(`❌ Nama file tidak valid: "${rawFileName}"`);
    console.error("   ✅ Gunakan kebab-case: huruf kecil, angka, dash (-)");
    console.error("   📌 Contoh valid:");
    console.error("      - penjualan-aktif");
    console.error("      - data-penjualan-harian");
    console.error("      - report-2024-q1");
    console.error("   🚫 Contoh invalid:");
    console.error("      - TestProduk (PascalCase)");
    console.error("      - test_produk (snake_case)");
    console.error("      - testProduk (camelCase)");
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
// 📁 BUILD PATH
// ─────────────────────────────────────────────
const baseDir = path.join(process.cwd(), "src/configs", ...folders);
const filePath = path.join(baseDir, `${rawFileName}Config.ts`);

// 🔐 Cek jika file sudah ada
if (fs.existsSync(filePath)) {
    console.error(`❌ Config sudah ada: ${filePath}`);
    process.exit(1);
}

// ─────────────────────────────────────────────
// 🏷️ NAMING UNTUK TYPESCRIPT
// ─────────────────────────────────────────────
const typeName = toPascalCase(rawFileName) + "Rows";   // TestProdukRows
const varName = toCamelCase(rawFileName) + "Columns";  // testProdukColumns

// ─────────────────────────────────────────────
// 📝 TEMPLATE
// ─────────────────────────────────────────────
const template = `// configs/${input}Config.ts
import { ColumnConfig } from "@/types/report";

/**
 * =========================================
 * 🔥 REPORT CONFIG: ${toPascalCase(rawFileName).toUpperCase()}
 * =========================================
 *
 * 📌 Cara pakai:
 * - Tambah field → edit di ${typeName}
 * - Atur tampilan tabel → edit di ${varName}
 *
 * 📌 Fitur otomatis:
 * - Header grouping berdasarkan \`group\`
 * - Warna header dari \`groupColor\`
 * - Search dari \`isSearchable\`
 * - Format angka + total dari \`isNumeric\`
 *
 * -----------------------------------------
 * 📦 ColumnConfig:
 * -----------------------------------------
 * field        → key data (WAJIB sesuai type)
 * label        → nama kolom di UI
 * isNumeric    → auto format number + total
 * isSearchable → ikut search filter
 * group        → grouping header
 * groupColor   → warna header group (Tailwind)
 *
 * -----------------------------------------
 * 📌 Contoh:
 * -----------------------------------------
 * {
 *   field: "nama",
 *   label: "Nama",
 *   isSearchable: true,
 *   group: "Info",
 *   groupColor: "bg-blue-400"
 * }
 */

export type ${typeName} = {
    // 🔥 isi field di sini
    field1: string;
    field2: number;
};

export const ${varName}: ColumnConfig<${typeName}>[] = [
    {
        field: "field1",
        label: "Field 1",
        isSearchable: true,
        group: "Info",
        groupColor: "bg-blue-400",
    },
    {
        field: "field2",
        label: "Field 2",
        isNumeric: true,
        group: "Data",
        groupColor: "bg-green-400",
    },
];
`;

// ─────────────────────────────────────────────
// 🚀 EKSEKUSI: Buat folder + tulis file
// ─────────────────────────────────────────────
fs.mkdirSync(baseDir, { recursive: true });
fs.writeFileSync(filePath, template);

console.log(`✅ Config berhasil dibuat:`);
console.log(`   📄 File : ${filePath}`);
console.log(`   🧩 Type: ${typeName}`);
console.log(`   📦 Var  : ${varName}`);

// // scripts/create-config.ts
// import fs from "fs";
// import path from "path";

// const input = process.argv[2];

// if (!input) {
//     console.error("❌ Masukkan nama config (contoh: perStruk atau test/testProduk)");
//     console.error("   Format: npm run create:config <path/NamaConfig>");
//     process.exit(1);
// }

// // 🔥 Helper: Ubah berbagai format → PascalCase (untuk Type)
// const toPascalCase = (str: string): string => {
//     return str
//         .split(/[-_\s]/) // split by dash, underscore, or space
//         .filter(Boolean)
//         .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//         .join("");
// };

// // 🔥 Helper: Ubah berbagai format → camelCase (untuk Variable)
// const toCamelCase = (str: string): string => {
//     const pascal = toPascalCase(str);
//     return pascal.charAt(0).toLowerCase() + pascal.slice(1);
// };

// // 🔥 Helper: Ubah berbagai format → kebab-case (untuk Filename)
// const toKebabCase = (str: string): string => {
//     return str
//         .replace(/([a-z])([A-Z])/g, "$1-$2") // camelCase → camel-Case
//         .replace(/[\s_]+/g, "-")             // space/underscore → dash
//         .replace(/^-+|-+$/g, "")             // trim dash di ujung
//         .toLowerCase();
// };

// // 🔥 Split path (support nested)
// const parts = input.split("/");
// const rawFileName = parts.pop()!; // "test-produk" atau "TestProduk" atau "test_produk"
// const folders = parts; // ["test"]

// // 🔥 Konversi ke berbagai format
// const kebabName = toKebabCase(rawFileName);    // "test-produk" → untuk filename
// const pascalName = toPascalCase(rawFileName);  // "TestProduk" → untuk Type
// const camelName = toCamelCase(rawFileName);    // "testProduk" → untuk Variable

// // 🔥 Build directory & file path
// const baseDir = path.join(process.cwd(), "src/configs", ...folders);
// const filePath = path.join(baseDir, `${kebabName}Config.ts`);

// // 🔥 Cek jika sudah ada
// if (fs.existsSync(filePath)) {
//     console.error(`❌ Config sudah ada: ${filePath}`);
//     process.exit(1);
// }

// // 🔥 Naming untuk TypeScript
// const typeName = pascalName + "Rows";      // TestProdukRows
// const varName = camelName + "Columns";     // testProdukColumns

// // 🔥 Template
// const template = `// configs/${input}Config.ts
// import { ColumnConfig } from "@/types/report";

// /**
//  * =========================================
//  * 🔥 REPORT CONFIG: ${pascalName.toUpperCase()}
//  * =========================================
//  *
//  * 📌 Cara pakai:
//  * - Tambah field → edit di ${typeName}
//  * - Atur tampilan tabel → edit di ${varName}
//  *
//  * 📌 Fitur otomatis:
//  * - Header grouping berdasarkan \`group\`
//  * - Warna header dari \`groupColor\`
//  * - Search dari \`isSearchable\`
//  * - Format angka + total dari \`isNumeric\`
//  *
//  * -----------------------------------------
//  * 📦 ColumnConfig:
//  * -----------------------------------------
//  * field        → key data (WAJIB sesuai type)
//  * label        → nama kolom di UI
//  * isNumeric    → auto format number + total
//  * isSearchable → ikut search filter
//  * group        → grouping header
//  * groupColor   → warna header group (Tailwind)
//  *
//  * -----------------------------------------
//  * 📌 Contoh:
//  * -----------------------------------------
//  * {
//  *   field: "nama",
//  *   label: "Nama",
//  *   isSearchable: true,
//  *   group: "Info",
//  *   groupColor: "bg-blue-400"
//  * }
//  */

// export type ${typeName} = {
//     // 🔥 isi field di sini
//     field1: string;
//     field2: number;
// };

// export const ${varName}: ColumnConfig<${typeName}>[] = [
//     {
//         field: "field1",
//         label: "Field 1",
//         isSearchable: true,
//         group: "Info",
//         groupColor: "bg-blue-400",
//     },
//     {
//         field: "field2",
//         label: "Field 2",
//         isNumeric: true,
//         group: "Data",
//         groupColor: "bg-green-400",
//     },
// ];
// `;

// // 🔥 Create folder recursive + write file
// fs.mkdirSync(baseDir, { recursive: true });
// fs.writeFileSync(filePath, template);

// console.log(`✅ Config berhasil dibuat:`);
// console.log(`   📄 File : ${filePath}`);
// console.log(`   🧩 Type: ${typeName}`);
// console.log(`   📦 Var  : ${varName}`);
// console.log(`   🏷️  Format: "${rawFileName}" → kebab:${kebabName} | pascal:${pascalName} | camel:${camelName}`);
