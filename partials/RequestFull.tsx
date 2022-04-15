import { FunctionComponent } from "react";
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
                                {request.drugItems.map((item, i) => (
                                    <tr key={i} className="break-inside-avoid">
                                        <td className="align-top">
                                            <h6>{item.originalText}</h6>
                                            {item.originalText ? <p>{item.drug.genericName}</p> : null}
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
                        <table className="table-auto w-full">
                            <thead className="w-full">
                                <tr>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {request.equipments.map((item, i) => (
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
        </div>
    )
}