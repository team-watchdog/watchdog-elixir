import randomstring from "randomstring";
import bcrypt from "bcrypt";
import validator from "validator";
import sgMail from "@sendgrid/mail";

import { prisma } from "../shared/clients/prisma";

// types 
import { CreateAccountInput, DeleteAccountInput, Account, SanitizedAccount, AccountType } from "../shared";

// errors
import { ValidationError, CustomError } from "../shared/errors";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ?  process.env.SENDGRID_API_KEY : "";
const APP_HOST_URL = process.env.APP_HOST_URL ? process.env.APP_HOST_URL : "";

class AdminService{
    static async CreateAccount(data: CreateAccountInput): Promise<SanitizedAccount> {
        const resetToken = randomstring.generate(20);
    
        if (!data.full_name || !data.email || !data.type) {
            throw new ValidationError("Missing input fields");
        }

        if (!validator.isEmail(data.email)) {
            throw new ValidationError("Enter a valid email");
        }
    
        // Check if the username's already there
    
        try {
            const account = await prisma.account.findFirst({
                where: {
                    email: data.email,
                }
            });
    
            if (account) {
                throw new CustomError("Email already in use", "CONFLICT");
            }
        } catch(e) {
            throw e;
        }
    
        // Hash the new password
    
        let hashedResetToken;
        try {
            hashedResetToken = await bcrypt.hash(resetToken, 10);
        } catch(e) {
            throw e;
        }
    
        try {
            // Insert user into database
            const account = await prisma.account.create({
                data: {
                    email: data.email,
                    full_name: data.full_name,
                    reset_code_hashed: hashedResetToken,
                    reset_code_sent_at: new Date(),
                    type: data.type,
                }
            });

            // Send Email
            sgMail.setApiKey(SENDGRID_API_KEY);
            sgMail.send({
                to: account.email,
                from: 'contact@appendix.tech',
                subject: 'Watchdog Elixir: Reset your password',
                templateId: "d-49d490f41d9d4fa38f977152a9d42c86",
                dynamicTemplateData: {
                    passwordResetLink: `${APP_HOST_URL}/auth/resetPassword?resetToken=${resetToken}&accountId=${account.id}`,
                },
            });

            console.log(`RESET CODE = ${resetToken}`);
            
            if (account) {
                const newAccount: SanitizedAccount = {
                    id: account.id,
                    email: account.email,
                    full_name: account.full_name,
                    type: account.type as AccountType,
                    
                    created_at: account.created_at,
                    last_updated_at: account.last_updated_at,
                }
    
                // Send Email
                /*
                sgMail.setApiKey(SENDGRID_API_KEY);
                const msg = {
                    to: account.email,
                    from: 'donotreply@paladinanalytics.com',
                    subject: 'You\'ve been given access to the Watchdog Admin Dashboard',
                    body: `Use this password to log-in: ${password}`,
                    html: `Use this password to log-in <b>${password}</b>`,
                };
                sgMail.send(msg);
                */
    
                // Send response to client
                return newAccount as Account;
            } else {
                throw new CustomError("Error creating account");
            }
        } catch(e) {
            throw e;
        }
    }
    
    static async GetAccounts(): Promise<SanitizedAccount[]> {
        const accounts: SanitizedAccount[] = await prisma.account.findMany({
            select: {
                id: true,
                email: true,
                full_name: true,
                type: true,
                created_at: true,
                last_updated_at: true,
            }
        }) as SanitizedAccount[];
        return accounts;
    }
    
    static async DeleteAccount(data: DeleteAccountInput): Promise<boolean> {
        const accountId = data.accountId;
    
        if (!accountId) {
            throw new CustomError("Missing fields");
        }
    
        try{
            const account = await prisma.account.delete({
                where: {
                    id: accountId
                }
            });
    
            if (!account) {
                throw new CustomError("Account not found");
            } else {
                return true;
            }
        } catch(e) {
            throw e;
        }
    }    
}

export default AdminService;