// src/components/form/evaluasisales/SelectDivisi.tsx
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
interface Divisi {
    div_kodedivisi: string;
    div_namadivisi: string;
}

interface SelectDivisiProps {
    control: Control<FilterDetailStrukInput>;
    placeholder?: string;
}

const SelectDivisi = ({
    control,
    placeholder = "All Divisi",
}: SelectDivisiProps) => {


    return (
        <DependentSelectWrapper<Divisi, FilterDetailStrukInput>
            control={control}
            name="div"
            endpoint="/select-divisi"
            labelAll={placeholder}
            placeholder={placeholder}
            getOption={(d) => ({
                label: `${d.div_kodedivisi} - ${d.div_namadivisi}`,
                value: d.div_kodedivisi,
            })}
            enableSearch
        />
    );
};

export default SelectDivisi;
