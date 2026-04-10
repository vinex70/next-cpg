
import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";
import { Control } from "react-hook-form";
/**
 * =========================================
 * 🧩 COMPONENT: Selectkategori
 * =========================================
 * 
 * 📍 Path: src/components/form/evaluasisales/Selectkategori.tsx
 * 🧩 Type: Client Component (interactive)
 * 🏷️  CSS Class: selectkategori
 * 
 * 📌 Tips:
 * - "use client" wajib untuk useState, useEffect, onClick, dll
 * - Gunakan clsx/tailwind-merge untuk conditional classes
 * - Extract logic kompleks ke custom hooks
 */

// 🔥 Props Interface
interface Kategori {
  div_kodedivisi: string;
  div_namadivisi: string;
  dep_kodedepartement: string;
  dep_namadepartement: string;
  kat_kodekategori: string;
  kat_namakategori: string;
}

interface SelectkategoriProps {
  control: Control<FilterDetailStrukInput>;
  placeholder?: string;
}
/**
 * Selectkategori Component
 */
const Selectkategori = ({
  control,
  placeholder = "All Kategori",
}: SelectkategoriProps) => {

  // Get Group Key
  const groupKey = (d: Kategori) => `${d.dep_kodedepartement} - ${d.dep_namadepartement}`;
  // Maping Option
  const getOption = (d: Kategori) => ({
    label: `${d.kat_kodekategori} - ${d.kat_namakategori}`,
    value: `${d.dep_kodedepartement}${d.kat_kodekategori}`,
  })

  return (
    <DependentSelectWrapper<Kategori, FilterDetailStrukInput>
      control={control}
      name="kat"
      parentName="dept"
      endpoint="/select-kategori"
      labelAll={placeholder}
      placeholder={placeholder}
      getGroupKey={groupKey}
      getOption={getOption}
      filterFn={(d, dept) => {
        const current = `${d.div_kodedivisi}${d.dep_kodedepartement}`;
        return current === dept;
      }}
      enableSearch
      sortGroups
      sortOptions
    />
  );
};

export default Selectkategori;
