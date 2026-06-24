import { Card } from '../ui/card'
import { CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SelectComponent from './SelectSorting'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector } from "@/app/hooks";
import type { RootState } from "@/app/store";

interface IProps {
    search: string;
    setSearch: (value: string) => void;
    sort: "asc" | "desc";
    setSort: (value: "asc" | "desc") => void;
    dataLength?: number;
    translationKey: string;
    showLang?: boolean;
    Lang?: "ar" | "en";
    setLang?: (value: "ar" | "en") => void;
}

const FilteringComponent = ({ search, setSearch, sort, setSort, dataLength, translationKey, showLang = false, Lang, setLang }: IProps) => {
    const { t } = useTranslation(translationKey);
    const lang = useAppSelector((state: RootState) => state.language.lang);
    const isRTL = lang === "ar";

    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle>
                    {t("filter")}
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="flex flex-col gap-4 md:flex-row">
                    {/* Search */}
                    <div className="relative w-full md:max-w-sm">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={18}
                        />

                        <Input
                            placeholder={t("search")}
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="pl-10 disabled:pointer-none"
                            disabled={!dataLength}
                        />
                    </div>

                    {/* Sort */}
                    <SelectComponent disabled={dataLength} sort={sort} onChangeSort={setSort} />

                    {/* Select Language */}
                    {showLang && (
                        <Select value={Lang}
                            onValueChange={(value: "ar" | "en") =>
                                setLang?.(value)
                            }>
                            <SelectTrigger className="w-full md:w-auto">
                                <SelectValue placeholder={`${isRTL ? "اللغة" : "Langauge"}`} />
                            </SelectTrigger>
                            <SelectContent className="bg-primary">
                                <SelectGroup>
                                    <SelectLabel>{isRTL ? "اختر اللغة" : "Select language"}</SelectLabel>
                                    <SelectItem value="desc">{isRTL ? "انجليزى" : "English"}</SelectItem>
                                    <SelectItem value="asc">{isRTL ? "عربى" : "Arabic"}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default FilteringComponent;
