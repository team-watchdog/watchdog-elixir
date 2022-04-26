// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sgMail from "@sendgrid/mail";

import { elasticClient } from "../../shared/clients/elastic";

// types
import { Request } from "../../shared/types";

const ForwardEmailsTo = process.env.FORWARD_EMAILS_TO ? process.env.FORWARD_EMAILS_TO.split(",") : [];
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ?  process.env.SENDGRID_API_KEY : "";

type Data = {
  status: unknown,
  results?: unknown,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.method !== "POST") res.status(406).json({ status: "invalid" });
    const body = req.body;

    const pledgeBody = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    try {
        const resp = await elasticClient.index({
            index: "pledges",
            document: pledgeBody,
        });

        console.log(resp);

        await elasticClient.indices.refresh({ index: "pledges" });

        // grab emails from request ids

        // send email with all requests
        try {
          sgMail.setApiKey(SENDGRID_API_KEY);
          await sgMail.send({
              to: ForwardEmailsTo,
              from: 'contact@appendix.tech',
              cc: [pledgeBody.email],
              subject: 'Watchdog Elixir: Reset your password',
              templateId: "d-88edc57277964b269a1eeedba11fb888",
              dynamicTemplateData: {
                id: resp._id,
                ...pledgeBody,
              },
              replyTo: pledgeBody.email,
          });
        } catch (e) {
            console.log("EMAIL ERROR");
            console.log(e.response.body);
        }

        // TODO: chunk requests into individual requirements and send out emails

        res.status(200).json({ status: "success" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: "error" });
    }

}
