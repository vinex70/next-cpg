
import { Control } from "react-hook-form";
import SelectTypeWrapper from "@/components/SelectTypeWrapper";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";
import { useQueryData } from "@/hooks/useQueryData";
/**
 * =========================================
 * 🧩 COMPONENT: Selectdepartement
 * =========================================
 * 📍 Path: src/components/form/evaluasisales/Selectdepartement.tsx
 * 🧩 Type: Client Component (interactive)
 * 🏷️  CSS Class: selectdepartement
 * 
 * 📌 Tips:
 * - "use client" wajib untuk useState, useEffect, onClick, dll
 * - Gunakan clsx/tailwind-merge untuk conditional classes
 * - Extract logic kompleks ke custom hooks
 */

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

interface Option {
  label: string;
  value: string;
}

interface GroupedOption {
  groupLabel: string;
  options: Option[];
}

/**
 * Selectdepartement Component
 */

const SelectDepartement = ({
  control,
  placeholder = "All Departement",
}: SelectDepartementProps) => {
  const { data, error, isLoading } = useQueryData<Departement[]>({
    endpoint: "/select-departement",
  });

  const groupedOptions: GroupedOption[] =
    data && data.length > 0
      ? Object.values(
        // map data ke grouped options
        data.reduce<Record<string, GroupedOption>>((acc, dept) => {
          const key = `${dept.div_kodedivisi} - ${dept.div_namadivisi}`;

          if (!acc[key]) {
            acc[key] = {
              groupLabel: key,
              options: [],
            };
          }

          acc[key].options.push({
            label: `${dept.dep_kodedepartement} - ${dept.dep_namadepartement}`,
            value: `${dept.div_kodedivisi}${dept.dep_kodedepartement}`,
          });

          return acc;
        }, {})
      )
      : [];

  const options: (Option | GroupedOption)[] = [
    { label: "All Departement", value: "__ALL__" },
    ...groupedOptions
  ]

  return (
    <SelectTypeWrapper<FilterDetailStrukInput>
      control={control}
      name="dept"
      data={options}
      loading={isLoading}
      error={!!error}
      placeholder={placeholder}
      valueKeyTransform={(val) => (val === "__ALL__" ? "" : val)}
      enableSearch
    />
  );

}

export default SelectDepartement
