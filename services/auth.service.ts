import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";
import randomstring from "randomstring";
import sgMail from "@sendgrid/mail";

// common
import { prisma } from "../shared/clients/prisma";

// types
import { SignInInput, SignInPayload, ResetPasswordPayload, ForgotPasswordInput } from "../shared";
import { CustomError, ValidationError } from "../shared/errors";

const JWT_SECRET = process.env.JWT_SECRET || "";
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ?  process.env.SENDGRID_API_KEY : "";
const APP_HOST_URL = process.env.APP_HOST_URL ? process.env.APP_HOST_URL : "";

class AuthService{
    static async SignIn(data: SignInInput): Promise<SignInPayload> {
        const email = data.email;
        const password = data.password;
    
        if (!email || !password) {
            throw new CustomError("Missing fields");
        }
        
        try {
            const rawAccount = await prisma.account.findFirst({
                where: {
                    email,
                }
            });
    
            if (!rawAccount) {
                throw new CustomError("Invalid email address");
            }
    
            if (!rawAccount.hashed_password || !bcrypt.compareSync(password, rawAccount.hashed_password)){
                throw new CustomError("Incorrect password");
            }
    
            const filteredAccount = { ...rawAccount } as any;
            if (filteredAccount["hashed_password"]) delete filteredAccount["hashed_password"];
    
            // Generate Token
            const token = jwt.sign({ id: rawAccount.id, type: rawAccount.type }, JWT_SECRET);
            return {
                account: filteredAccount,
                token,
            }
        } catch(e) {
            console.log(e);
            throw e;
        }
    }

    static async ForgotPassword(data: ForgotPasswordInput): Promise<boolean> {
        const resetToken = randomstring.generate(20);
        const email = data.email as string;

        // Hash the new password
    
        let hashedResetToken;
        try {
            hashedResetToken = await bcrypt.hash(resetToken, 10);
        } catch(e) {
            throw e;
        }
    
        if (!email) {
            throw new CustomError("Missing fields");
        }

        
        try {
            const account = await prisma.account.findFirst({
                where: {
                    email,
                }
            });

            if (!account) {
                throw new CustomError("Email not found", "NOT_FOUND");
            }

            console.log(`RESET TOKEN = ${resetToken}`);

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

            const updated = await prisma.account.update({
                where: {
                    id: account.id,
                },
                data: {
                    reset_code_hashed: hashedResetToken,
                    reset_code_sent_at: new Date(),
                }
            });
            return true;
        } catch(e) {
            console.log(e);
            throw e;
        }
    }

    static async ResetPassword(data: ResetPasswordPayload): Promise<boolean> {
        let account;

        if (!data.newPassword || data.newPassword.length < 6) {
            throw new ValidationError("Password should have at least 6 characters");
        }

        try {
            account = await prisma.account.findFirst({
                where: {
                    id: data.accountId,
                }
            });
        } catch (e) {
            throw new CustomError("Account not found", "NOT_FOUND");
        }

        if (!account) {
            throw new CustomError("Account not found", "NOT_FOUND");
        }

        if (!account.reset_code_hashed || !bcrypt.compareSync(data.resetToken, account.reset_code_hashed)){
            throw new CustomError("Invalid reset token");
        }

        if (moment(account.reset_code_sent_at).add(1, "day") < moment()) {
            throw new CustomError("Reset token expired");
        }

        let hashPassword;
        try {
            hashPassword = await bcrypt.hash(data.newPassword, 10);
        } catch(e) {
            throw e;
        }

        try {
            await prisma.account.update({
                where: {
                    id: account.id,
                },
                data: {
                    reset_code_hashed: null,
                    reset_code_sent_at: null,
                    hashed_password: hashPassword,
                }
            })
        } catch (e) {
            throw new CustomError("Internal Error");
        }

        return true;
    }
}

export default AuthService;