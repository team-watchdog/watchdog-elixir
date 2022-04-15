export interface Drug{
    id: string;
    genericName: string;
    brandName: string;
    schedule: string;
    country: string;
    expiryDate: string;
    aliases?: string[];
    importer: {
        id: string;
        name: string;
    }
}