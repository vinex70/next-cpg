// scripts/create-component.ts
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const componentName = args[0];
const isServer = args.includes("--server");

// ─────────────────────────────────────────────
// 🔧 HELPERS: Konversi nama
// ─────────────────────────────────────────────

const toPascalCase = (str: string): string => {
  return str
    .split(/[-_\s]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
};

// ─────────────────────────────────────────────
// 🧩 PROSES INPUT
// ─────────────────────────────────────────────
if (!componentName) {
  console.error("❌ Masukkan nama component (contoh: UserProfile atau forms/SubmitButton)");
  console.error("   💡 Format: npm run create:component <path/NamaComponent> [--server]");
  console.error("   🏷️  Flag opsional:");
  console.error("      --server  → Generate Server Component (tanpa 'use client')");
  console.error("      (default) → Generate Client Component (dengan 'use client')");
  process.exit(1);
}

const parts = componentName.split("/");
const rawName = parts.pop()!;
const folders = parts.map(toKebabCase);

const pascalName = toPascalCase(rawName);
const fileName = `${pascalName}.tsx`;
const kebabName = toKebabCase(pascalName);

// ─────────────────────────────────────────────
// 📁 BUILD PATH
// ─────────────────────────────────────────────
const baseDir = path.join(process.cwd(), "src", "components", ...folders);
const filePath = path.join(baseDir, fileName);

if (fs.existsSync(filePath)) {
  console.error(`❌ Component sudah ada: ${filePath}`);
  process.exit(1);
}

// ─────────────────────────────────────────────
// 📝 TEMPLATE (Next.js + TypeScript + Tailwind)
// ─────────────────────────────────────────────

// Template Client Component (default)
const clientTemplate = `
import React from "react";

/**
 * =========================================
 * 🧩 COMPONENT: ${pascalName}
 * =========================================
 * 
 * 📍 Path: src/components/${[...folders, fileName].join("/")}
 * 🧩 Type: Client Component (interactive)
 * 🏷️  CSS Class: ${kebabName}
 * 
 * 📌 Tips:
 * - "use client" wajib untuk useState, useEffect, onClick, dll
 * - Gunakan clsx/tailwind-merge untuk conditional classes
 * - Extract logic kompleks ke custom hooks
 */

// 🔥 Props Interface
export interface ${pascalName}Props {
  // Tambah props di sini
  variant?: "default" | "primary" | "secondary";
  className?: string;
  children?: React.ReactNode;
}

/**
 * ${pascalName} Component
 */
export const ${pascalName}: React.FC<${pascalName}Props> = ({
  variant = "default",
  className = "",
  children,
  ...props
}) => {
  // 🔥 Contoh: state untuk interaktivitas
  // const [isActive, setIsActive] = React.useState(false);

  return (
    <div
      className={\`
        ${kebabName}
        \${variant === "primary" ? "bg-blue-500 text-white" : "bg-gray-100"}
        \${className}
      \`}
      {...props}
    >
      {/* 🔥 Konten component dimulai di sini */}
      {children}
    </div>
  );
};

export default ${pascalName};
`;

// Template Server Component (--server flag)
const serverTemplate = `import React from "react";

/**
 * =========================================
 * 🧩 COMPONENT: ${pascalName}
 * =========================================
 * 
 * 📍 Path: src/components/${[...folders, fileName].join("/")}
 * 🧩 Type: Server Component (data fetching, SEO)
 * 🏷️  CSS Class: ${kebabName}
 * 
 * 📌 Tips:
 * - Server Component default di Next.js App Router
 * - Bisa fetch data langsung di component (async/await)
 * - Tidak bisa pakai useState, useEffect, onClick
 * - Untuk interaktivitas, wrap dengan Client Component
 */

// 🔥 Props Interface
export interface ${pascalName}Props {
  // Tambah props di sini
  variant?: "default" | "primary" | "secondary";
  className?: string;
  children?: React.ReactNode;
}

/**
 * ${pascalName} Component (Server)
 */
export const ${pascalName}: React.FC<${pascalName}Props> = async ({
  variant = "default",
  className = "",
  children,
  ...props
}) => {
  // 🔥 Contoh: fetch data langsung di server component
  // const data = await fetch("https://api.example.com/data").then(r => r.json());

  return (
    <div
      className={\`
        ${kebabName}
        \${variant === "primary" ? "bg-blue-500 text-white" : "bg-gray-100"}
        \${className}
      \`}
      {...props}
    >
      {/* 🔥 Konten component dimulai di sini */}
      {children}
    </div>
  );
};

export default ${pascalName};
`;

const template = isServer ? serverTemplate : clientTemplate;

// ─────────────────────────────────────────────
// 🚀 EKSEKUSI: Buat folder + tulis file
// ─────────────────────────────────────────────
fs.mkdirSync(baseDir, { recursive: true });
fs.writeFileSync(filePath, template);

const componentType = isServer ? "Server" : "Client";
console.log(`✅ Component berhasil dibuat:`);
console.log(`   📄 File        : ${filePath}`);
console.log(`   🧩 Component   : ${pascalName}`);
console.log(`   🏷️  Type       : ${componentType} Component`);
console.log(`   🏷️  CSS Class  : ${kebabName}`);
console.log(`   🗂️  Folder     : ${folders.length > 0 ? folders.join("/") : "(root components)"}`);
console.log(``);
console.log(`💡 Cara import:`);
console.log(`   import ${pascalName} from "@/components/${[...folders, fileName].join("/")}"`);
if (!isServer) {
  console.log(`⚠️  Catatan: Component ini menggunakan "use client" untuk interaktivitas`);
}