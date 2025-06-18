// src/components/Modal.tsx
import React, { useEffect, useRef } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Lock scroll when modal is shown
    useEffect(() => {
        if (show) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [show]);

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
                className="bg-white dark:bg-zinc-900 rounded shadow-lg p-6 w-fit max-w-[95vw] max-h-[90vh] relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 mb-4"
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
