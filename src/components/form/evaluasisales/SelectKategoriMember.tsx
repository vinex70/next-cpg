
import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";
import { Control } from "react-hook-form";

/**
 * =========================================
 * 🧩 COMPONENT: SelectKategoriMember
 * =========================================
 * 
 * 📍 Path: src/components/form/evaluasisales/SelectKategoriMember.tsx
 * 🧩 Type: Client Component (interactive)
 * 🏷️  CSS Class: select-kategori-member
 * 
 * 📌 Tips:
 * - "use client" wajib untuk useState, useEffect, onClick, dll
 * - Gunakan clsx/tailwind-merge untuk conditional classes
 * - Extract logic kompleks ke custom hooks
 */

// 🔥 Props Interface

export interface SelectKategoriMember {
  grp_idgroupkat: string;
  grp_group: string;
  grp_kategori: string;
  grp_subkategori: string;
}

interface SelectKategoriMemberProps {
  control: Control<FilterDetailStrukInput>;
  placeholder?: string;
}


export const SelectKategoriMember = ({ control, placeholder = "All Kategori" }: SelectKategoriMemberProps) => {

  const getGroupKey = (d: SelectKategoriMember) => `${d.grp_group} - ${d.grp_kategori}`;
  return (
    <DependentSelectWrapper<SelectKategoriMember, FilterDetailStrukInput>
      control={control}
      name="katMember"
      endpoint="/select-kategori-member"
      labelAll={placeholder}
      placeholder={placeholder}
      getGroupKey={getGroupKey}
      getOption={(d) => ({
        label: `${d.grp_subkategori}`,
        value: d.grp_idgroupkat,
      })}
      enableSearch
    />
  );
};