import { FunctionComponent } from "react";
import Image from 'next/image';
import moment from "moment";

// types
import { Pledge } from "../shared/types";

// assets
import DrugsIcon from "../public/drug.png";
import EquipmentIcon from "../public/equipment.png";
import Link from "next/link";

interface PledgeItemProps{
    pledge: Pledge;
}

export const PledgeItem: FunctionComponent<PledgeItemProps> = ({ pledge } : PledgeItemProps) => {
    return (
        <div className="flex justify-between py-4">
            <div>
                <Link href={`/pledge/${pledge.id}`}><a href=""><h3 className="text-xl font-bold">{pledge.name}</h3></a></Link>
                {/*}
                <div className="py-2">
                    <Link href={`/request/${request.id}`}><a href=""><h4 className="text-md"><span className="font-semibold">Requested By:</span> {request.name}</h4></a></Link>
                    <h4><span className="font-semibold">Requester Designation:</span> {request.designation ? <span>{request.designation}</span> : null}</h4>
                </div>
                */}
                <h4 className="text-md">{moment(pledge.createdAt).format("LLL")}</h4>
            </div>
            <div className="flex gap-x-4">
                <Link href={`/pledge/${pledge.id}`}><a href="">
                <div className="flex items-center gap-x-2 py-2">
                    <div className="w-8 h-8"><Image src={DrugsIcon} layout="responsive" /> </div>
                    <h4 className="text-3xl font-semibold">{pledge.drugItems ? pledge.drugItems.length : "—"}</h4>
                </div>
                </a></Link>

                <Link href={`/pledge/${pledge.id}`}><a href="">
                <div className="flex items-center gap-x-2 py-2">
                    <div className="w-8 h-8"><Image src={EquipmentIcon} layout="responsive" /> </div>
                    <h4 className="text-3xl font-semibold">{pledge.equipments ? pledge.equipments.length : "—"}</h4>
                </div>
                </a></Link>
            </div>
        </div>
    )
}