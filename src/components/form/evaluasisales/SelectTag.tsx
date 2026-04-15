
import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";
import { Control } from "react-hook-form";

/**
 * =========================================
 * 🧩 COMPONENT: Selecttag
 * =========================================
 * 
 * 📍 Path: src/components/form/evaluasisales/Selecttag.tsx
 * 🧩 Type: Client Component (interactive)
 * 🏷️  CSS Class: selecttag
 * 
 * 📌 Tips:
 * - "use client" wajib untuk useState, useEffect, onClick, dll
 * - Gunakan clsx/tailwind-merge untuk conditional classes
 * - Extract logic kompleks ke custom hooks
 */

// 🔥 Props Interface
interface Tag {
  tag_kodetag: string;
  tag_keterangan: string;
}

interface SelecttagProps {
  control: Control<FilterDetailStrukInput>
  placeholder?: string
}

const SelectTag = ({ control, placeholder = "All Tag" }: SelecttagProps) => {

  return (
    <DependentSelectWrapper<Tag, FilterDetailStrukInput>
      control={control}
      name="tag"
      endpoint="/select-tag"
      labelAll={placeholder}
      placeholder={placeholder}
      getOption={(d) => ({
        label: `${d.tag_kodetag} - ${d.tag_keterangan}`,
        value: d.tag_kodetag,
      })}
      enableSearch
    />
  );
}

export default SelectTag