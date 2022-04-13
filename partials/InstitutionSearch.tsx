import { FunctionComponent, useState, useCallback, ChangeEventHandler, useEffect } from "react";
import delay from "delay";
import { debounce } from "lodash";
import axios from "axios";

// partials
import Loading from "../partials/Loading";

// types
import { Institution } from "../shared/types";

interface InsititutionItemProps{
    institution: Institution;
    onSelect: (selected: Institution) => void;
}

const InstitutionItem: FunctionComponent<InsititutionItemProps> = (props: InsititutionItemProps) => {
    const { institution, onSelect } = props;

    return (
        <div className="flex px-4 py-2 cursor-pointer" onMouseDown={() => {
            onSelect(institution);
        }}>
            <div className="flex flex-1 flex-col">
                <div className="flex justify-start gap-x-2 items-center">
                    <h6 className="break-all pr-4 font-semibold">{institution.fullName}</h6>
                </div>
                <div className="flex justify-start gap-x-2 items-center py-1">
                    <span className="py-1 px-2 text-sm bg-gray-200 rounded-md">{institution.province}</span>
                    <span className="py-1 px-2 text-sm bg-gray-200 rounded-md">{institution.district}</span>
                </div>
            </div>
        </div>
    );
}

interface ChangeListener{
    target: {
        value: string
    }
}

interface InstitutionSearchProps{
    onSelect(selected: Institution): void;
    selected?: Institution;
}

const InstitutionSearch: FunctionComponent<InstitutionSearchProps> = (props) => {
    const { onSelect, selected } = props;

    useEffect(() => {
        if (selected) setSearchTerm(selected.fullName);
    }, [selected])

    const [ searchTerm, setSearchTerm ] = useState<string>("");
    const [ onFocus, setOnFocus ] = useState<boolean>(false);
    const [ results, setResults ] = useState<Institution[]>([]);
    const [ loading, setLoading ] = useState<boolean>(false);

    const loadSuggestions = async (text: string) => {
        try {
            const results = await axios.post("/api/institutions", {
                searchTerm: text,
            });

            setResults(results.data.results);
            setLoading(false);

        } catch (e) {
            console.log(e);
        }
    }

    const debouncedChangeHandler = useCallback(debounce(loadSuggestions, 600), []);

    const onSearchTermChange = (e: ChangeListener) => {
        setSearchTerm(e.target.value);
        setLoading(true);
        debouncedChangeHandler(e.target.value);
    }
    
    return (
        <div className="flex flex-1 flex-col relative">
            <input
                type="text"
                className="flex-1 px-4 py-2 border rounded-md border-zinc-300"
                placeholder="Search for institutions"
                value={searchTerm}
                onChange={onSearchTermChange}
                onFocus={() => {
                    setOnFocus(true);
                    setSearchTerm("");
                    setResults([]);
                }}
                onBlur={async () => {
                    if (selected) setSearchTerm(selected.fullName);
                    setOnFocus(false);
                }}
            />
            {onFocus && searchTerm.length > 3 ? (
                <div 
                    id="dropdownTop" 
                    className="bg-white py-2 max-h-[300px] overflow-y-scroll rounded-t-sm rounded-b-md border border-zinc-200 shadow-sm z-50 divide-y divide-zinc-200 absolute mt-10 w-full"
                >
                    {!loading ? (
                        results.length > 0 ? results.map((institution, i) => (
                        <InstitutionItem 
                            institution={institution} 
                            key={i} 
                            onSelect={async (selected) => {
                                onSelect(selected);

                                await delay(400);
                                setSearchTerm(selected.fullName);
                                setResults([]);
                            }}
                        />
                    )): (
                        <div className="py-2 px-4">
                            <h6>No results found</h6>
                        </div>
                    ) ): (
                        <Loading />
                    )}
                </div>
            ) : null}
        </div>
    );
}

export default InstitutionSearch;