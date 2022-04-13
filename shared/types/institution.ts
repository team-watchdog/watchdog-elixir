export interface Institution{
    name: string;
    fullName: string;
    type1: string;
    type2: string;
    ownership: string;
    rdhs: string;
    sn: number;
    field4: number;
    check: number;
    hin: string;
    geo: {
        lat: number | null;
        lon: number | null;
    }
    placeId: string;
    district: string;
    province: string;
}