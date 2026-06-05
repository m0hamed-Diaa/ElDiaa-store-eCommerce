import { Card } from '../ui/card'
import { CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SelectComponent from './SelectSorting'

interface IProps {
    search: string;
    setSearch: (value: string) => void;
    sort: "asc" | "desc";
    setSort: (value: "asc" | "desc") => void;
    dataLength?: number;
    translationKey: string;
}

const FilteringComponent = ({ search, setSearch, sort, setSort, dataLength, translationKey }: IProps) => {
    const { t } = useTranslation(translationKey);
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
                </div>
            </CardContent>
        </Card>
    )
}

export default FilteringComponent;
