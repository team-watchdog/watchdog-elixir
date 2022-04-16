export interface Equipment{
    itemName: string;
    itemDescription?: string;
    quantity?: number;
}

export interface EquipmentResult{
    id: string;
    item: string;
    unit: string;
    importer: {
        id: string | null;
        name: string | null;
    }
}