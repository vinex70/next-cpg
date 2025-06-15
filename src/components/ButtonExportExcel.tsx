import { RiFileExcel2Line } from "react-icons/ri"
import { Button } from "@/components/ui/button"

interface ButtonExportExcelProps {
    handleExport: () => void;
    className?: string;
}

const ButtonExportExcel = ({ handleExport, className }: ButtonExportExcelProps) => {
    return (
        // Function to handle export to Excel
        <Button
            variant="outline"
            className={`hover:cursor-pointer ${className ? ` ${className}` : "mb-4 bg-green-400 hover:bg-green-500 dark:bg-green-400 dark:hover:bg-green-500"}`}
            size="sm"
        >
            <span className="flex items-center gap-2" onClick={handleExport}>
                <RiFileExcel2Line />
                Export to Excel
            </span>
        </Button>

    )
}

export default ButtonExportExcel
