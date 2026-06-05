import {
    Table,
    TableBody,
    TableCaption,
    TableFooter,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next"


interface TableDemoProps {
    tableHeader: ReactNode;
    tableBody: ReactNode;
    tableFooter?: ReactNode;
    translationKey: string;
}

export function DataTable({ tableHeader, tableBody, tableFooter, translationKey }: TableDemoProps) {
    const { t } = useTranslation(translationKey);
    return (
        <Table className=" [&_thead]:bg-primary/10 [&_thead]:text-primary-foreground/90
                [&_tbody_tr:nth-child(even)]:bg-primary/12        
                [&_tbody_tr]:border-b
                [&_tbody_tr]:transition-colors
                [&_tbody_tr:hover]:bg-primary/5
                dark:[&_tbody_tr:hover]:bg-primary/10
                [&_thead]:backdrop-blur
                [&_tbody_td]:py-4">
            <TableCaption>{t("tableCaption")}</TableCaption>
            <TableHeader>
                <TableRow>
                    {tableHeader}
                </TableRow>
            </TableHeader>
            <TableBody>
                {tableBody}
            </TableBody>
            <TableFooter>
                <TableRow>
                    {tableFooter}
                </TableRow>
            </TableFooter>
        </Table>
    )
}
