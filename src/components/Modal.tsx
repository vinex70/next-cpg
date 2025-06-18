import React, { useEffect, useRef } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Esc key close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();

        if (show) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [show, onClose]);

    // Click outside modal content
    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={handleClickOutside}
        >
            <div
                ref={modalRef}
                className="bg-white rounded shadow-lg p-6 w-full max-w-md relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    aria-label="Close Modal"
                >
                    <IoCloseCircleSharp size={30} className="text-red-500 hover:text-red-800" />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
