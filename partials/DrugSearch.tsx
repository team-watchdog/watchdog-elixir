import { FunctionComponent, useState, useCallback, ChangeEventHandler } from "react";
import delay from "delay";
import { debounce } from "lodash";
import axios from "axios";

// partials
import Loading from "../partials/Loading";

// types
import { Drug } from "../shared/types";

interface DrugItemProps{
    drug: Drug;
    onSelect: (selected: Drug) => void;
}

const DrugItem: FunctionComponent<DrugItemProps> = (props: DrugItemProps) => {
    const { drug, onSelect } = props;

    return (
        <div className="flex px-4 py-2 cursor-pointer" onMouseDown={() => {
            onSelect(drug);
        }}>
            <div className="flex flex-1 flex-col">
                <div className="flex justify-start gap-x-2 items-center">
                    <h6 className="break-all pr-4">{drug.genericName}</h6>
                </div>
                <div className="py-1">
                    <p>{drug.brandName}</p>
                </div>
                <div className="flex justify-start gap-x-2 items-center py-1">
                    <span className="py-1 px-2 text-sm bg-gray-200 rounded-md">{drug.country}</span>
                    <span className="py-1 px-2 text-sm bg-gray-200 rounded-md">{drug.schedule}</span>
                </div>
                <div className="py-1">
                    <p>{drug.importer.name}</p>
                </div>
            </div>
            <div>
                <button 
                    className="px-2 py-1 bg-blue-3 text-white rounded-md"
                    onMouseDown={async () => {
                        onSelect(drug);
                    }}
                >
                    Add to Request
                </button>
            </div>
        </div>
    );
}

interface ChangeListener{
    target: {
        value: string
    }
}

interface DrugSearchProps{
    onSelect(selected: Drug): void;
}

const DrugSearch: FunctionComponent<DrugSearchProps> = (props) => {
    const { onSelect } = props;

    const [ searchTerm, setSearchTerm ] = useState<string>("");
    const [ onFocus, setOnFocus ] = useState<boolean>(false);
    const [ results, setResults ] = useState<Drug[]>([]);
    const [ loading, setLoading ] = useState<boolean>(false);

    const loadSuggestions = async (text: string) => {
        try {
            const results = await axios.post("/api/drugs", {
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
                placeholder="Search for drug names"
                value={searchTerm}
                onChange={onSearchTermChange}
                onFocus={() => setOnFocus(true)}
                onBlur={async () => {
                    await delay(400);
                    setOnFocus(false);
                }}
            />
            {onFocus && searchTerm.length > 3 ? (
                <div 
                    id="dropdownTop" 
                    className="bg-white py-2 max-h-[300px] overflow-y-scroll rounded-t-sm rounded-b-md border border-zinc-200 shadow-sm z-50 divide-y divide-zinc-200 absolute mt-10 w-full"
                >
                    {!loading ? (
                        results.length > 0 ? results.map((drug, i) => (
                        <DrugItem 
                            drug={drug} 
                            key={i} 
                            onSelect={async (selected) => {
                                onSelect(selected);

                                await delay(400);
                                setSearchTerm("");
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

export default DrugSearch;