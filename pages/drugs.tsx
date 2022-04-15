import { useState, useCallback, FunctionComponent } from 'react';
import { debounce } from "lodash";
import axios from "axios";
import { useRouter } from 'next/router';

// partials
import HeadMeta from "../partials/HeadMeta";
import Loading from "../partials/Loading";

// types
import { Drug } from "../shared/types";

const BUCKET_URI = process.env.NEXT_PUBLIC_STATIC_BUCKET_URI;

interface ChangeListener{
    target: {
        value: string
    }
}


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
                    <h6 className="break-all pr-4 uppercase">{drug.genericName}</h6>
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
        </div>
    );
}

interface DrugsProps {
}

const Drugs = (props: DrugsProps) => {
  const [ searchTerm, setSearchTerm ] = useState("");
  const [ results, setResults ] = useState<Drug[]>([]);
  const [ loading, setLoading ] = useState<boolean>(false);

  const router = useRouter();
  
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
    <div>
      <HeadMeta 
        title="Watchdog — An open source research collective."
        description="Watchdog is a multidisciplinary team of factcheckers, journalists, researchers and software engineers. We hunt hoaxes and misinformation, investigate matters of public welfare, and build software tools that help operations like ours."
        image={`${BUCKET_URI}/meta-blue.png`}
        imageAlt={"Watchdog logo"}
      />
      <main>
        <div className="container">
          <div className="py-4 mt-2 border-b border-zinc-200 flex justify-between items-center">
            <h2 className="text-xl font-bold">Drugs</h2>
            <a href="/newDrug" className="py-2 px-4 bg-zinc-700 text-white rounded-md">New Drug</a>
          </div>
          <div className="flex py-4">
              <input 
                type="search" 
                placeholder="Search for drugs" 
                className="flex-1 px-4 py-2 border rounded-md border-zinc-300"
                value={searchTerm}
                onChange={onSearchTermChange}
              />
          </div>
          <div className="divide-y divide-zinc-200">
            {!loading ? (
                results.length > 0 ? results.map((drug, i) => (
                <DrugItem 
                    drug={drug} 
                    key={i} 
                    onSelect={async (selected) => {
                        router.push(`/drug/${selected.id}/edit`);
                        //onSelect(selected);

                        //await delay(400);
                        //setSearchTerm("");
                        //setResults([]);
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
         <div>
         </div>
        </div>
      </main>
    </div>
  )
}

export default Drugs;
