import { useState } from "react";
import FormInput from "../FormInput";
import { Search } from "lucide-react";
import InputProdukModal from "../modal/InputProdukModal";

const InputProdukPlu = () => {
    const [supplierModal, setSupplierModal] = useState(false);
    const handleSupplierModal = () => {
        setSupplierModal(!supplierModal);
    }

    return (
        <>
            <FormInput
                name="prdcd"
                placeholder="Input Plu"
                iconRight={<Search className="w-4 h-4" />}
                onIconClick={handleSupplierModal}
            />

            <InputProdukModal show={supplierModal} onClose={handleSupplierModal} prdcd />
        </>
    )
}

export default InputProdukPlu