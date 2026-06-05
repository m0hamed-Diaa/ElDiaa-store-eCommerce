import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface IProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationDemo = ({
    currentPage,
    totalPages,
    onPageChange,
}: IProps) => {

    const pages = Array.from(
        { length: totalPages },
        (_, i) => i + 1
    );

    return (
        <Pagination className="my-10">
            <PaginationContent>

                {/* PREVIOUS */}
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() =>
                            currentPage > 1 &&
                            onPageChange(currentPage - 1)
                        }
                        className={
                            currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>

                {/* PAGES */}
                {pages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            isActive={currentPage === page}
                            onClick={() => onPageChange(page)}
                            className="cursor-pointer"
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {/* NEXT */}
                <PaginationItem>
                    <PaginationNext
                        onClick={() =>
                            currentPage < totalPages &&
                            onPageChange(currentPage + 1)
                        }
                        className={
                            currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>

            </PaginationContent>
        </Pagination>
    );
};

export default PaginationDemo;