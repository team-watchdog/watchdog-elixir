import { FunctionComponent, useState } from "react";
import Image from 'next/image';
import { useRouter } from "next/router";
import axios from "axios";
import moment from "moment";
import Link from "next/link";

// types
import { Request } from "../shared/types";

// assets
import DrugsIcon from "../public/drug.png";
import EquipmentIcon from "../public/equipment.png";

const styles = {
    field: "flex flex-col gap-y-2 mb-4",
    label: "flex-1 font-semibold",
    input: "flex-1 px-4 py-2 border rounded-md border-zinc-300",
}

interface RequestFullProps{
    request: Request;
}

export const RequestFull: FunctionComponent<RequestFullProps> = ({ request } : RequestFullProps) => {
    const router = useRouter();

    const [ drugSearchTerm, setDrugSearchTerm ] = useState("");
    const [ instiuteSearchTerm, setInstituteSearchTerm ] = useState("");

    return (
        <div className="flex flex-col py-4">
            <div className="flex justify-between">
                <div>
                    <h3 className="text-xl font-semibold">{request.title ? request.title : request.institution?.fullName}</h3>
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
            <div className="flex justify-between py-2 mt-2">
                <div>
                    <button 
                        className="py-1 px-2 bg-zinc-700 text-white rounded-md"
                        onMouseDown={() => {
                            window.print();
                        }}
                    >Print</button>
                </div>
                <div className="flex gap-x-2">
                    <Link href={`/request/${request.id}/edit`}><a className="py-1 px-2 bg-blue-1 text-white rounded-md">Edit Request</a></Link>
                    <button 
                        className="py-1 px-2 bg-rating-red text-white rounded-md"
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
                    >Delete Request</button>
                </div>
            </div>
            <div className="flex flex-col py-2">
                {request.drugItems.length > 0 ? (
                    <>
                        <h3 className="font-semibold text-lg py-2">Drugs</h3>
                        <div className="flex py-4">
                            <input 
                                type="search" 
                                placeholder="Filter drugs" 
                                className="flex-1 px-4 py-2 border rounded-md border-zinc-300"
                                onChange={(e) => setDrugSearchTerm(e.target.value)}
                                value={drugSearchTerm}
                            />
                        </div>
                        <table className="table-auto w-full">
                            <thead className="w-full">
                                <tr>
                                    <th>Generic Name</th>
                                    <th>Brand Name</th>
                                    <th>Importer</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {request.drugItems.filter((item) => item.drug.genericName.match(new RegExp(drugSearchTerm, "ig"))).map((item, i) => (
                                    <tr key={i} className="break-inside-avoid">
                                        <td className="align-top">
                                            {item.originalText ? <h6>{item.originalText}</h6> : null}
                                            <p>{item.drug.genericName}</p>
                                        </td>
                                        <td className="align-top">{item.drug.brandName}</td>
                                        <td className="align-top">{item.drug.importer.name}</td>
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
            <div className="flex flex-col py-2">
                {request.equipments.length > 0 ? (
                    <>
                        <h3 className="font-semibold text-lg py-2">Medical Equipment and Other</h3>
                        <div className="flex py-4">
                            <input 
                                type="search" 
                                placeholder="Filter equipment" 
                                className="flex-1 px-4 py-2 border rounded-md border-zinc-300"
                                onChange={(e) => setInstituteSearchTerm(e.target.value)}
                                value={instiuteSearchTerm}
                            />
                        </div>
                        <table className="table-auto w-full">
                            <thead className="w-full">
                                <tr>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {request.equipments.filter((item) => item.itemName.match(new RegExp(instiuteSearchTerm, "ig"))).map((item, i) => (
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
            <div className="py-4 px-6 bg-yellow-0 rounded-md mb-4">
                <h5 className="font-semibold text-lg mb-1">Disclaimer</h5>
                <p className="mb-2"><b className="font-semibold">Using the data:</b> Elixir attempts to match a request with data (brand and generic names, suppliers) from the NMRA lists. This match is the closest available, but will sometimes differ - for example, the closest match to a request for Metoprolol Tartrate inj. 5mgin 5ml is METOPROLOL TARTRATE TABLETS BP 50MG. We're leaving these in because it's likely that the supplier of the tablet form of the medicine will know best where to source the injection version from.</p>
                <p className="mb-2"><b className="font-semibold">The data is presented as follows:</b> Requested generic drug (with the name of the closest match in our database under it), brand name of closest match, supplier of closest match.</p>
                <p className="mb-2"><b className="font-semibold">Issues with data:</b> Our database is not perfect. While Elixir was able to match most requests here with their official supplier, we were not able to find all on the NMRA suppliers lists. If you find local suppliers for these unfound drugs, please drop a comment on this public spreadsheet: <a className="text-blue-1" href="https://docs.google.com/spreadsheets/d/1ysvpnOYhej0Kc7L_JwuZFalhuoRX85OcE3CeyLNK4_o/edit#gid=0">Go to spreadsheet</a></p>
                <p className="mb-2">Or let us know at contact@appendix.tech or tag @TeamWatchdog on Twitter.</p>
            </div>
        </div>
    )
}