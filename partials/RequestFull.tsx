import { FunctionComponent, useState } from "react";
import Image from 'next/image';
import { useRouter } from "next/router";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { Tab } from "@headlessui/react";
import { Button } from "./Button";
import { PlusIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/outline";

// types
import { Request, Account, Pledge } from "../shared/types";

// partials
import SectionHeader from "./SectionHeader";

// assets
import DrugsIcon from "../public/drug.png";
import EquipmentIcon from "../public/equipment.png";
import { ChevronIcon } from "@mantine/core/lib/components/Select/SelectRightSection/ChevronIcon";

// stores
import { pledgeStore } from "../shared/stores/pledge";

// helpers
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

const styles = {
    field: "flex flex-col gap-y-2 mb-4",
    label: "flex-1 font-semibold text-base",
    input: "flex-1 px-4 py-2 border rounded-md border-zinc-300",
}

interface RequestFullProps{
    request: Request;
    account: Account | null;
}

export const RequestFull: FunctionComponent<RequestFullProps> = ({ request, account } : RequestFullProps) => {
    const router = useRouter();

    const [ drugSearchTerm, setDrugSearchTerm ] = useState("");
    const [ instiuteSearchTerm, setInstituteSearchTerm ] = useState("");

	const setPledge = pledgeStore((state) => state.setPledge);
	const pledge = pledgeStore((state) => state.pledge);

    const tabs = ["Details", "Updates"];

    const drugAlreadyAddedToPledge = (genericName: string, brandName: string, pledge: Pledge): boolean => {
        if (!pledge.drugItems) return false;
        const index = pledge.drugItems.findIndex((drug) => drug.drug.genericName === genericName && drug.drug.brandName === brandName);

        if (index >= 0) return true;
        return false;
    }

    const equipmentAlreadyAddedToPledge = (equipmentName: string, pledge: Pledge): boolean => {
        console.log(equipmentName, pledge.equipments);
        if (!pledge.equipments) return false;
        const index = pledge.equipments.findIndex((equipment) => equipment.itemName === equipmentName);
        console.log(index);

        if (index >= 0) return true;
        return false;
    }

    return (
        <div className="flex flex-col py-4">
            <div className="flex justify-between">
                <div>
                    <h3 className="text-xl font-bold">{request.title ? request.title : request.institution?.fullName}</h3>
                    <div>
                        <div className="py-4">
                            <h4><span className="font-semibold">Request ID:</span> {request.id}</h4>
                            <h4><span className="font-semibold">Request Submitted On:</span> {moment(request.createdAt).format("LLL")}</h4>
                            <Link href={`/request/${request.id}`}><a href=""><h4 className="text-md"><span className="font-semibold">Requested By:</span> {request.name}</h4></a></Link>
                            <h4><span className="font-semibold">Requester Designation:</span> {request.designation ? <span>{request.designation}</span> : null}</h4>
                            {request.contactNumber ? <h4><span className="font-semibold">Requester Contact Number:</span> <a className="text-blue-2 font-semibold" href={`tel:${request.contactNumber}`}>{request.contactNumber}</a></h4> : null}
                        </div>
                    </div>
                </div>
                <div className="flex gap-x-4">
                    <div className="flex items-center gap-x-2 py-2">
                        <div className="w-8 h-8"><Image src={DrugsIcon} layout="responsive" /> </div>
                        <h4 className="text-3xl font-semibold">{request.drugItems ? request.drugItems.length : 0}</h4>
                    </div>
                    <div className="flex items-center gap-x-2 py-2">
                        <div className="w-8 h-8"><Image src={EquipmentIcon} layout="responsive" /> </div>
                        <h4 className="text-3xl font-semibold">{request.equipments ? request.equipments.length : 0}</h4>
                    </div>
                </div>
            </div>
            {account ? (
                <div className="flex justify-between py-2 mt-2">
                    <div>
                        <Button 
                            type="default"
                            label="Print Request"
                            onMouseDown={() => {
                                window.print();
                            }}
                        />
                    </div>
                    <div className="flex gap-x-2">
                        <Button
                            label="Edit Request"
                            type="primary"
                            onMouseDown={async () => {
                                router.push(`/request/${request.id}/edit`);
                            }}
                        />
                        <Button
                            label="Delete Request"
                            type="danger"
                            onMouseDown={async () => {
                                const response = confirm("Are you sure you want to delete this request?");

                                if (response) {
                                    try {
                                        await axios.delete(`/api/requests/${request.id}`);
                                        router.push("/");
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            ) : null}
            
            <div className="mt-2">
                {/*
                <Tab.Group>
                    <Tab.List className="px-1 py-1 space-x-1 bg-slate-100 rounded-md">
                        {tabs.map((tab, i) => (
                            <Tab
                                key={i}
                                className={({ selected }) =>
                                classNames(
                                    'px-4 py-2.5 flex-1 font-ui text-md leading-5 font-semibold text-blue-700 rounded-md',
                                    'focus:outline-none',
                                selected
                                    ? 'bg-blue-3 text-white'
                                    : 'text-blue-100 hover:bg-blue-3 hover:text-white'
                                )
                            }
                            >
                                {tab}
                            </Tab>
                        ))}
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel className="px-2">
                            <SectionHeader
                                Left={<>Details</>}
                            />
                        */}
                            <SectionHeader
                                Left={<>Details</>}
                            />
                            <div>
                                <div className="flex flex-col">
                                    {request.drugItems.length > 0 ? (
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
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {request.drugItems.filter((item) => item.drug.genericName.match(new RegExp(drugSearchTerm.replace(/\\/ig, ""), "ig"))).map((item, i) => (
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
                                                            <td className="align-top">
                                                                <Button 
                                                                    type="default"
                                                                    label={<>Add to pledge <PlusIcon width={18} height={18} /></>}
                                                                    disabled={drugAlreadyAddedToPledge(item.drug.genericName, item.drug.brandName, pledge)}
                                                                    onMouseDown={() => {
                                                                        console.log(item);
                                                                        setPledge({
                                                                            ...pledge,
                                                                            drugItems: [
                                                                                ...(pledge.drugItems ? pledge.drugItems : []),
                                                                                {
                                                                                    drug: item.drug,
                                                                                    originalText: item.originalText,
                                                                                    quantity: undefined,
                                                                                },
                                                                            ]
                                                                        })
                                                                    }}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                    ) : null}
                                </div>
                                <div className="flex flex-col py-2">
                                    {request.equipments.length > 0 ? (
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
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {request.equipments.filter((item) => item.itemName.match(new RegExp(instiuteSearchTerm.replace(/\\/ig, ""), "ig"))).map((item, i) => (
                                                        <tr key={i} className="break-inside-avoid">
                                                            <td className="align-top">
                                                                <b>{item.itemName}</b>
                                                                <p>{item.itemDescription}</p>
                                                            </td>
                                                            <td className="align-top">
                                                                <p>{item.quantity ? item.quantity : "—"}</p>
                                                            </td>
                                                            <td className="align-top">
                                                                <Button 
                                                                    type="default"
                                                                    label={<>Add to pledge <PlusIcon width={18} height={18} /></>}
                                                                    disabled={equipmentAlreadyAddedToPledge(item.itemName, pledge)}
                                                                    onMouseDown={() => {
                                                                        setPledge({
                                                                            ...pledge,
                                                                            equipments: [
                                                                                ...(pledge.equipments ? pledge.equipments : []),
                                                                                {
                                                                                    itemName: item.itemName,
                                                                                    itemDescription: item.itemDescription,
                                                                                    quantity: undefined,
                                                                                },
                                                                            ]
                                                                        })
                                                                    }}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                    ) : null}
                                </div>
                                <div className={`${styles.field} py-4`}>
                                    <label className={styles.label}>Additional Notes</label>
                                    {!request.additionalNotes ? (
                                        <p>—</p>
                                    ) : (
                                        <>
                                            {request.additionalNotes.split("\n").map((para, i) => (
                                                <p key={i}>{para}</p>
                                            ))}
                                        </>
                                    )}
                                </div>
                                <div className="py-4 px-4 bg-yellow-0 mb-4">
                                    <h5 className="font-semibold text-lg mb-1">Disclaimer</h5>
                                    <p className="mb-2"><b className="font-semibold">Using the data:</b> Elixir attempts to match a request with data (brand and generic names, suppliers) from the NMRA lists. This match is the closest available, but will sometimes differ - for example, the closest match to a request for Metoprolol Tartrate inj. 5mgin 5ml is METOPROLOL TARTRATE TABLETS BP 50MG. We're leaving these in because it's likely that the supplier of the tablet form of the medicine will know best where to source the injection version from.</p>
                                    <p className="mb-2"><b className="font-semibold">The data is presented as follows:</b> Requested generic drug (with the name of the closest match in our database under it), brand name of closest match, supplier of closest match.</p>
                                    <p className="mb-2"><b className="font-semibold">Issues with data:</b> Our database is not perfect. While Elixir was able to match most requests here with their official supplier, we were not able to find all on the NMRA suppliers lists. If you find local suppliers for these unfound drugs, please drop a comment on this public spreadsheet: <a className="text-blue-1" href="https://docs.google.com/spreadsheets/d/1ysvpnOYhej0Kc7L_JwuZFalhuoRX85OcE3CeyLNK4_o/edit#gid=0">Go to spreadsheet</a></p>
                                    <p className="mb-2">Or let us know at contact@appendix.tech or tag @TeamWatchdog on Twitter.</p>
                                </div>
                            </div>
                        {/*
                        </Tab.Panel>
                        <Tab.Panel className="px-2">
                            <SectionHeader
                                Left={<>Updates</>}
                                Right={(
                                    <Button
                                        label="Post an update"
                                        type="primary"
                                        onMouseDown={() => {

                                        }}
                                    />
                                )}
                            />
                            <div className="flex flex-col">
                                <div className="py-6 border-b border-b-gray-200">
                                    <h6 className="font-semibold">Posted 6 hours ago</h6>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer congue finibus nisi, non aliquam felis interdum ac. Sed et eleifend nunc, ac semper massa. Phasellus sem leo, luctus scelerisque cursus eu, cursus eget quam. Fusce posuere nisi sem, lobortis placerat leo elementum nec. Nullam auctor finibus nisl, eget rhoncus erat. Nulla faucibus lorem sit amet arcu elementum, nec vehicula metus faucibus. Etiam suscipit venenatis pharetra. Quisque eu justo et ligula finibus lacinia. Morbi sed nibh vulputate, dictum ligula vitae, lobortis felis. Cras metus lacus, euismod a rutrum a, luctus eget erat. Nullam eget convallis odio, sed tempor nunc.</p>
                                    <div className="flex flex-row gap-x-2 pt-4">
                                        <div className="font-semibold flex gap-x-2 flex-row justify-start bg-white py-2 px-4 rounded-md border-gray-200 border items-center text-gray-400">
                                            <a href="https://google.com" target={"_blank"}><span>Invoice.pdf</span></a>
                                        </div>
                                        <div className="font-semibold flex gap-x-2 flex-row justify-start bg-white py-2 px-4 rounded-md border-gray-200 border items-center text-gray-400">
                                            <a href="https://google.com" target={"_blank"}><span>Purchase Order.pdf</span></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="py-6">
                                    <h6 className="font-semibold">6 hours ago</h6>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer congue finibus nisi, non aliquam felis interdum ac. Sed et eleifend nunc, ac semper massa. Phasellus sem leo, luctus scelerisque cursus eu, cursus eget quam. Fusce posuere nisi sem, lobortis placerat leo elementum nec. Nullam auctor finibus nisl, eget rhoncus erat. Nulla faucibus lorem sit amet arcu elementum, nec vehicula metus faucibus. Etiam suscipit venenatis pharetra. Quisque eu justo et ligula finibus lacinia. Morbi sed nibh vulputate, dictum ligula vitae, lobortis felis. Cras metus lacus, euismod a rutrum a, luctus eget erat. Nullam eget convallis odio, sed tempor nunc.</p>
                                </div>
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
                                    */}
            </div>
        </div>
    )
}