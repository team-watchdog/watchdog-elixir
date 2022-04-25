import { File } from "./file";
import { Equipment } from "./equipment";
import { DrugRequestItem } from "./request";

export interface Pledge{
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    notes: string;
    files: File[];
    drugItems: DrugRequestItem[];
    equipments: Equipment[];
    createdAt?: Date;
    updatedAt?: Date;
}