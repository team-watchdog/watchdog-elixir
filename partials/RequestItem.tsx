import { FunctionComponent } from "react";
import Image from 'next/image';
import moment from "moment";

// types
import { Request } from "../shared/types";

// assets
import DrugsIcon from "../public/drug.png";
import EquipmentIcon from "../public/equipment.png";
import Link from "next/link";

interface RequestItemProps{
    request: Request;
}

export const RequestItem: FunctionComponent<RequestItemProps> = ({ request } : RequestItemProps) => {
    return (
        <div className="flex justify-between py-4">
            <div>
                <Link href={`/request/${request.id}`}><a href=""><h3 className="text-xl font-semibold">{request.institution?.fullName}</h3></a></Link>
                <h4 className="text-md">{request.name} {request.designation ? <span>({request.designation})</span> : null}</h4>
                <h4 className="text-md">{moment(request.createdAt).format("LLL")}</h4>
            </div>
            <div className="flex gap-x-4">
                <div className="flex items-center gap-x-2 py-2">
                    <div className="w-8 h-8"><Image src={DrugsIcon} layout="responsive" /> </div>
                    <h4 className="text-3xl font-semibold">{request.drugItems.length}</h4>
                </div>
                <div className="flex items-center gap-x-2 py-2">
                    <div className="w-8 h-8"><Image src={EquipmentIcon} layout="responsive" /> </div>
                    <h4 className="text-3xl font-semibold">{request.equipments.length}</h4>
                </div>
            </div>
        </div>
    )
}