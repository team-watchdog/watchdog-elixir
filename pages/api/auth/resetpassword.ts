import type { NextApiRequest, NextApiResponse } from "next";

// types
import { ResetPasswordPayload, ErrorResponse } from "../../../shared/types";
import { ValidationError, CustomError } from "../../../shared/errors";

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
          const body: ResetPasswordPayload = req.body;

          try {
              const resp = await AuthService.ResetPassword(body);
              console.log(resp);
          } catch (e) {
            console.log(e);
            if ((e as ValidationError).name === "ValidationError") {
              res.status(406).json({ status: "Validation Error", message: (e as ValidationError).message });
            }
            
            if ((e as CustomError).name === "CustomError") {
                res.status(500).json({ status: "Reset Password Error", message: (e as CustomError).message });
            }
          }
      }
  
      res.status(200).json({ status: "Success" });
  }