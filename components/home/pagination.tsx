import React from "react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <div className="flex space-x-1 justify-center">
            {pageNumbers.map((number) => (
                <Button
                    key={number}
                    variant={currentPage === number ? "destructive" : "outline"}
                    size="icon"
                    className={`w-8 h-8 rounded-none ${currentPage === number ? "bg-custom-red hover:bg-custom-red" : "text-gray-500 hover:bg-custom-red border border-gray-300 hover:text-white"
                        }`}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </Button>
            ))}
        </div>
    )
}
