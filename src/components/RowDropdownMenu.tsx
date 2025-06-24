import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface Action {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
}

interface RowDropdownMenuProps {
    label?: string | React.ReactNode; // ⬅️ Tambahkan label custom
    actions: Action[];
    showLabel?: boolean;
    triggerIconOnly?: boolean;
}

const RowDropdownMenu: React.FC<RowDropdownMenuProps> = ({
    label,
    actions,
    showLabel = true,
    triggerIconOnly = false,
}) => {
    return (
        <DropdownMenu modal={true}>
            <DropdownMenuTrigger asChild>
                {triggerIconOnly ? (
                    <Button variant="ghost" size="sm" className="p-1 text-blue-600">
                        <MoreHorizontal size={16} />
                    </Button>
                ) : (
                    <Button variant="link" size="sm" className="text-blue-600 hover:cursor-pointer">
                        Detail
                    </Button>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
                {showLabel && label && (
                    <>
                        <DropdownMenuLabel className="font-bold">{label}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuGroup>
                    {actions.map((action, i) => (
                        <DropdownMenuItem key={i} onClick={action.onClick}>
                            <div className="flex items-center gap-2 text-blue-600 hover:underline hover:cursor-pointer">
                                {action.icon}
                                <span>{action.label}</span>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default RowDropdownMenu;
