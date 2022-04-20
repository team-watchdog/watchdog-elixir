import { SanitizedAccount } from "./account";

export interface SignInInput {
    email: string;
    password: string;
}

export interface SignInPayload {
    token: string;
    account: SanitizedAccount;
}

export interface ResetPasswordPayload{
    accountId: number;
    resetToken: string;
    newPassword: string;
}

export interface ForgotPasswordInput {
    email: string;
}