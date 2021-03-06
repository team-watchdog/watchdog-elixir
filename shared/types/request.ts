import { Drug } from "./drug";
import { Institution } from "./institution";
import { Equipment } from "./equipment";

export interface DrugRequestItem{
    drug: Drug;
    originalText?: string;
    quantity?: number;
}

export interface Request{
    id: string;
    title?: string;
    name?: string;
    institution?: Institution;
    designation?: string;
    createdAt?: Date;
    updatedAt?: Date;
    contactNumber?: string;
    email?: string;
    drugItems: DrugRequestItem[];
    equipments: Equipment[];
    additionalNotes: string;
}