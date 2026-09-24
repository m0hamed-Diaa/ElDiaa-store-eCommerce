import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/lib/useLocale";

interface IProps {
    sort: "asc" | "desc";
    onChangeSort: (value: "asc" | "desc") => void;
    disabled?: number;
}

const SelectComponent = ({ sort, onChangeSort, disabled }: IProps) => {
    const { isRTL } = useLocale();
    return (
        <Select value={sort}
            onValueChange={(value: "asc" | "desc") =>
                onChangeSort(value)
            }
            disabled={disabled === 0}>
            <SelectTrigger className="w-full md:w-auto disabled:pointer-event-none">
                <SelectValue placeholder={`${isRTL ? "تصفية" : "Filtering"}`} />
            </SelectTrigger>
            <SelectContent className="bg-primary">
                <SelectGroup>
                    <SelectLabel>{isRTL ? "ترتيب" : "Sort By"}</SelectLabel>
                    <SelectItem value="desc">{isRTL ? "الأحدث" : "Newest"}</SelectItem>
                    <SelectItem value="asc">{isRTL ? "الأقدم" : "Oldest"}</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default SelectComponent;
