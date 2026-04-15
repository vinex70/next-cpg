
import { useState } from "react";
import FormInput from "../FormInput";
import { Search } from "lucide-react";
import InputProdukModal from "../modal/InputProdukModal";

/**
 * =========================================
 * 🧩 COMPONENT: InputNamaProduk
 * =========================================
 * 
 * 📍 Path: src/components/input/InputNamaProduk.tsx
 * 🧩 Type: Client Component (interactive)
 * 🏷️  CSS Class: input-nama-produk
 * 
 * 📌 Tips:
 * - "use client" wajib untuk useState, useEffect, onClick, dll
 * - Gunakan clsx/tailwind-merge untuk conditional classes
 * - Extract logic kompleks ke custom hooks
 */


const InputNamaProduk = () => {
  const [produkModal, setProdukModal] = useState(false);
  const handleProdukModal = () => {
    setProdukModal(!produkModal);
  }

  return (
    <>
      <FormInput
        name="namaBarang"
        placeholder="Nama Produk"
        iconRight={<Search className="w-4 h-4" />}
        onIconClick={handleProdukModal}
      />

      <InputProdukModal show={produkModal} onClose={handleProdukModal} namaBarang />
    </>
  )
}

export default InputNamaProduk