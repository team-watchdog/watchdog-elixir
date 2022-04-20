export enum AccountType{
    ADMIN = "ADMIN",
    ORGANIZATION = "ORGANIZATION"
}

export interface Account{
    id: number;
    email: string;
    full_name: string;
    hashed_password: string;
    default_password: boolean;
    reset_code_hashed?: string;

    type: AccountType;

    created_at: Date;
    last_updated_at: Date;
}

export interface SanitizedAccount{
    id: number;
    email: string;
    full_name: string;
    type: AccountType;

    created_at: Date;
    last_updated_at: Date;
}

export interface CreateAccountInput {
    email: string;
    full_name: string;
    type: AccountType;
}

export interface DeleteAccountInput {
    accountId: number;
}