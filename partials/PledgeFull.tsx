import { FunctionComponent, useState } from "react";
import Image from 'next/image';
import { useRouter } from "next/router";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { Tab } from "@headlessui/react";
import { Button } from "./Button";
import { PlusIcon, ChevronDownIcon } from "@heroicons/react/outline";

// types
import { Request, Account, Pledge } from "../shared/types";

// partials
import SectionHeader from "./SectionHeader";

// assets
import DrugsIcon from "../public/drug.png";
import EquipmentIcon from "../public/equipment.png";

// helpers
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

const styles = {
    field: "flex flex-col gap-y-2 mb-4",
    label: "flex-1 font-semibold text-base",
    input: "flex-1 px-4 py-2 border rounded-md border-zinc-300",
}

interface PledgeFullProps{
    pledge: Pledge;
    account: Account | null;
}

export const PledgeFull: FunctionComponent<PledgeFullProps> = ({ pledge, account } : PledgeFullProps) => {
    const router = useRouter();

    const [ drugSearchTerm, setDrugSearchTerm ] = useState("");
    const [ instiuteSearchTerm, setInstituteSearchTerm ] = useState("");

    const tabs = ["Details", "Updates"];

    return (
        <div className="flex flex-col py-4">
            <div className="flex justify-between">
                <div>
                    <h3 className="text-xl font-bold">{pledge.name}</h3>
                    <div>
                        <div className="py-4">
                            <h4><span className="font-semibold">Pledge ID:</span> {pledge.id}</h4>
                            <h4><span className="font-semibold">Request Submitted On:</span> {moment(pledge.createdAt).format("LLL")}</h4>
                            {pledge.email ? <h4><span className="font-semibold">Pledger Email:</span> <a className="text-blue-2 font-semibold" href={`mailto:${pledge.email}`}>{pledge.email}</a></h4> : null}
                            {pledge.phoneNumber ? <h4><span className="font-semibold">Pledger Contact Number:</span> <a className="text-blue-2 font-semibold" href={`tel:${pledge.phoneNumber}`}>{pledge.phoneNumber}</a></h4> : null}
                        </div>
                    </div>
                </div>
                <div className="flex gap-x-4">
                    <div className="flex items-center gap-x-2 py-2">
                        <div className="w-8 h-8"><Image src={DrugsIcon} layout="responsive" /> </div>
                        <h4 className="text-3xl font-semibold">{pledge.drugItems ? pledge.drugItems.length : 0}</h4>
                    </div>
                    <div className="flex items-center gap-x-2 py-2">
                        <div className="w-8 h-8"><Image src={EquipmentIcon} layout="responsive" /> </div>
                        <h4 className="text-3xl font-semibold">{pledge.equipments ? pledge.equipments.length : 0}</h4>
                    </div>
                </div>
            </div>
            {account ? (
                <div className="flex justify-between py-2 mt-2">
                    <div>
                        <Button 
                            type="default"
                            label="Print Pledge"
                            onMouseDown={() => {
                                window.print();
                            }}
                        />
                    </div>
                    {account && account.type === "ADMIN" ? (
                        <div className="flex gap-x-2">
                            <Button
                                label="Delete Pledge"
                                type="danger"
                                onMouseDown={async () => {
                                    const response = confirm("Are you sure you want to delete this pledge?");

                                    if (response) {
                                        try {
                                            await axios.delete(`/api/pledges/${pledge.id}`);
                                            router.push("/pledges");
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }
                                }}
                            />
                        </div>
                    ) : null}
                </div>
            ) : null}
            
            <div className="mt-2">
                <SectionHeader
                    Left={<>Details</>}
                />
                <div>
                    <div className="flex flex-col">
                        {pledge.drugItems && pledge.drugItems.length > 0 ? (
                            <>
                                <div className="bg-white pt-4">
                                    <h3 className="font-semibold py-1 text-base">Drugs</h3>
                                    <div className="flex pt-2 pb-4">
                                        <input 
                                            type="search" 
                                            placeholder="Filter drugs" 
                                            className="flex-1 px-4 py-2 border rounded-md border-zinc-300"
                                            onChange={(e) => setDrugSearchTerm(e.target.value)}
                                            value={drugSearchTerm}
                                        />
                                    </div>
                                </div>
                                <table className="table-fixed w-full">
                                    <thead className="w-full">
                                        <tr>
                                            <th colSpan={2}>
                                                <div className="flex justify-between items-center">
                                                    Generic Name <a href=""><ChevronDownIcon width={18} height={18} /></a>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="flex justify-between items-center">
                                                    Brand Name <a href=""><ChevronDownIcon width={18} height={18} /></a>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="flex justify-between items-center">
                                                    Importer <a href=""><ChevronDownIcon width={18} height={18} /></a>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="flex justify-between items-center">
                                                    Quantity <a href=""><ChevronDownIcon width={18} height={18} /></a>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pledge.drugItems.filter((item) => item.drug.genericName.match(new RegExp(drugSearchTerm.replace(/\\/ig, ""), "ig"))).map((item, i) => (
                                            <tr key={i} className="break-inside-avoid">
                                                <td className="align-top" colSpan={2}>
                                                    {item.originalText ? <h6 className="font-semibold">{item.originalText}</h6> : null}
                                                    <p>{item.drug.genericName}</p>
                                                </td>
                                                <td className="align-top">{item.drug.brandName ? item.drug.brandName : "—"}</td>
                                                <td className="align-top">{item.drug.importer.name ? item.drug.importer.name : "—"}</td>
                                                <td className="align-top">
                                                    <p>{item.quantity ? item.quantity.toLocaleString() : "—"}</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        ) : null}
                    </div>
                    <div className="flex flex-col py-2">
                        {pledge.equipments && pledge.equipments.length > 0 ? (
                            <>
                                <div className="bg-white pt-4">
                                    <h3 className="font-semibold text-base py-1">Medical Equipment and Other</h3>
                                    <div className="flex pt-2 pb-4">
                                        <input 
                                            type="search" 
                                            placeholder="Filter equipment" 
                                            className="flex-1 px-4 py-2 border rounded-md border-zinc-300"
                                            onChange={(e) => setInstituteSearchTerm(e.target.value)}
                                            value={instiuteSearchTerm}
                                        />
                                    </div>
                                </div>
                                <table className="table-fixed w-full">
                                    <thead className="w-full">
                                        <tr>
                                            <th>Name</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pledge.equipments.filter((item) => item.itemName.match(new RegExp(instiuteSearchTerm.replace(/\\/ig, ""), "ig"))).map((item, i) => (
                                            <tr key={i} className="break-inside-avoid">
                                                <td className="align-top">
                                                    <b>{item.itemName}</b>
                                                    <p>{item.itemDescription}</p>
                                                </td>
                                                <td className="align-top">
                                                    <p>{item.quantity ? item.quantity : "—"}</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        ) : null}
                    </div>
                    <div className={`${styles.field} py-4`}>
                        <label className={styles.label}>Notes</label>
                        {!pledge.notes? (
                            <p>—</p>
                        ) : (
                            <>
                                {pledge.notes.split("\n").map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}