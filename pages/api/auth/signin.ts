import type { NextApiRequest, NextApiResponse } from "next";

// types
import { SignInInput, ErrorResponse } from "../../../shared/types";
import { ValidationError, CustomError } from "../../../shared/errors";

// utils
import { RequestWithCookie, getAppCookies, verifyToken } from "../../../middleware/utils";

// handlers
import AuthService from "../../../services/auth.service";

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
          const body: SignInInput = req.body;

          try {
              const resp = await AuthService.SignIn(body);
              return res.status(200).json({ status: "Success", message: "Signed In Successfully", body: resp });
          } catch (e) {
            console.log(e);
            if ((e as ValidationError).name === "ValidationError") {
              return res.status(406).json({ status: "Validation Error", message: (e as ValidationError).message });
            }
            
            if ((e as CustomError).name === "CustomError") {
                return res.status(409).json({ status: "Sign In Error", message: (e as CustomError).message });
            }
          }
      }
  
      return res.status(500).json({ status: "Failed" });
  }