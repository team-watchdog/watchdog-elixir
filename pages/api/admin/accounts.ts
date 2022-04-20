import type { NextApiRequest, NextApiResponse } from "next";

// services
import AdminService from "../../../services/admin.service";

// types
import { CreateAccountInput, } from "../../../shared/types";

// utils
import { RequestWithCookie, getAppCookies, verifyToken } from "../../../middleware/utils";
import { CustomError, ValidationError } from "../../../shared/errors";

type ResponseData = {
    status: string;
    message?: string;
    body?: unknown;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
  ) {
      if (req.method === "POST") {
          const body: CreateAccountInput = req.body;

          try {
            await AdminService.CreateAccount(body);
          } catch (e) {
              console.log(e);
              if ((e as ValidationError).name === "ValidationError") {
                res.status(406).json({ status: "Validation Error", message: (e as ValidationError).message });
              }
              if ((e as CustomError).name === "CustomError") {
                  res.status(409).json({ status: "Email already in use", message: "The email you entered is already in use." });
              }
          }

          const cookies = getAppCookies(req as RequestWithCookie);
          const token = cookies["token"];

          if (token) {
            const temp = verifyToken(token as string);
            console.log(`TMP`);
            console.log(temp);
          }
      }
  
      res.status(201).json({ status: "success" });
  }