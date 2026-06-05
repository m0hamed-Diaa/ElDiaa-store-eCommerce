import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector } from "@/app/hooks";
import type { RootState } from "@/app/store";

interface IProps {
    sort: "asc" | "desc";
    onChangeSort: (value: "asc" | "desc") => void;
    disabled?: number;
}

const SelectComponent = ({ sort, onChangeSort, disabled }: IProps) => {
    const lang = useAppSelector((state: RootState) => state.language.lang);
    const isRTL = lang === "ar";
    return (
        <Select value={sort}
            onValueChange={(value: "asc" | "desc") =>
                onChangeSort(value)
            }
            disabled={disabled === 0}>
            <SelectTrigger className="w-full md:w-auto disabled:pointer-event-none">
                <SelectValue placeholder={`${isRTL ? "تصفية" : "Filtering"}`} />
            </SelectTrigger>
            <SelectContent>
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
