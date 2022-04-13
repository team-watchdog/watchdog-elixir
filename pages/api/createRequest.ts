// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { elasticClient } from "../../shared/clients/elastic";

// types
import { Request } from "../../shared/types";

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

    try {
        const resp = await elasticClient.index({
            index: "requests",
            document: {
              ...body,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
        });

        await elasticClient.indices.refresh({ index: "requests" });
        res.status(200).json({ status: "success" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: "error" });
    }

}
