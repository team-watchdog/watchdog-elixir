import { useState, useCallback, FunctionComponent } from 'react';
import { debounce, result } from "lodash";
import axios from "axios";
import { useRouter } from 'next/router';

// partials
import HeadMeta from "../partials/HeadMeta";
import Loading from "../partials/Loading";

// types
import { EquipmentResult } from "../shared/types";
import { Button } from '../partials/Button';
import Link from 'next/link';

const BUCKET_URI = process.env.NEXT_PUBLIC_STATIC_BUCKET_URI;

interface ChangeListener{
    target: {
        value: string
    }
}


interface EquipmentItemProps{
    equipment: EquipmentResult;
    onDelete: () => void;
}

const EquipmentItem: FunctionComponent<EquipmentItemProps> = (props: EquipmentItemProps) => {
    const { equipment, onDelete } = props;

    return (
        <div className="flex px-4 py-2 cursor-pointer">
            <div className="flex flex-1 flex-row justify-between">
                <div>
                    <div className="flex justify-start gap-x-2 items-center">
                        <Link href={`/equipment/${equipment.id}/edit`}><a><h6 className="break-all pr-4 uppercase">{equipment.item}</h6></a></Link>
                    </div>
                    <div className="flex justify-start gap-x-2 items-center py-1">
                        <span className="py-1 px-2 text-sm bg-gray-200 rounded-md"><span className="font-semibold">Unit: </span>{equipment.unit}</span>
                    </div>
                </div>
                <div>
                    <Button 
                        type="danger"
                        label="Delete"
                        onMouseDown={() => {
                            onDelete();
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

interface EquipmentsProps {
}

const Equipments = (props: EquipmentsProps) => {
  const [ searchTerm, setSearchTerm ] = useState("");
  const [ results, setResults ] = useState<EquipmentResult[]>([]);
  const [ loading, setLoading ] = useState<boolean>(false);

  const router = useRouter();
  
  const loadSuggestions = async (text: string) => {
      try {
          const results = await axios.post("/api/equipments", {
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
            <h2 className="text-xl font-bold">Equipment</h2>
            <a href="/newEquipment" className="py-2 px-4 bg-zinc-700 text-white rounded-md">New Equipment</a>
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
                results.length > 0 ? results.map((equipment, i) => (
                <EquipmentItem 
                    equipment={equipment} 
                    key={i} 
                    onDelete={async () => {
                        const res = confirm("Are you sure you want to delete this?");

                        if (res) {
                            try {
                                await axios.delete(`/api/equipments/${equipment.id}`);
                                const updatedEquip = [
                                    ...results.slice(0, i),
                                    ...results.slice(i + 1, results.length),
                                ];
                                setResults(updatedEquip);
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        console.log(res);
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

export default Equipments;
