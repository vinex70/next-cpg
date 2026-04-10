// src/components/form/evaluasisales/Selectdepartement.tsx

import { Control } from "react-hook-form";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";
import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";

/**
//  * =========================================
//  * 🧩 COMPONENT: Selectdepartement
//  * =========================================
//  * 📍 Path: src/components/form/evaluasisales/Selectdepartement.tsx
//  * 🧩 Type: Client Component (interactive)
//  * 🏷️  CSS Class: selectdepartement
//  * 
//  * 📌 Tips:
//  * - "use client" wajib untuk useState, useEffect, onClick, dll
//  * - Gunakan clsx/tailwind-merge untuk conditional classes
//  * - Extract logic kompleks ke custom hooks
//  
**/

// 🔥 Props Interface
interface Departement {
  div_kodedivisi: string;
  div_namadivisi: string;
  dep_kodedepartement: string;
  dep_namadepartement: string;
}

interface SelectDepartementProps {
  control: Control<FilterDetailStrukInput>;
  placeholder?: string;
}

const SelectDepartement = ({
  control,
  placeholder = "All Departement",
}: SelectDepartementProps) => {

  // 🔥 grouping
  const groupKey = (d: Departement) =>
    `${d.div_kodedivisi} - ${d.div_namadivisi}`;
  // Mapping Option
  const getOption = (d: Departement) => ({
    label: `${d.dep_kodedepartement} - ${d.dep_namadepartement}`,
    value: `${d.div_kodedivisi}${d.dep_kodedepartement}`,
  })

  return (
    <DependentSelectWrapper<Departement, FilterDetailStrukInput>
      control={control}
      name="dept"
      parentName="div"
      endpoint="/select-departement"
      labelAll={placeholder}
      placeholder={placeholder}
      getOption={getOption}
      getGroupKey={groupKey}

      // 🔥 filter by parent
      filterFn={(d, div) =>
        d.div_kodedivisi === div
      }
      enableSearch
      sortGroups
      sortOptions
    />
  );
};

export default SelectDepartement;
