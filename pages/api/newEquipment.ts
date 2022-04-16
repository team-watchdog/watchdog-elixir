// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { elasticClient } from "../../shared/clients/elastic";

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
            index: "equipments",
            document: {
              ...body,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
        });

        await elasticClient.indices.refresh({ index: "equipments" });
        res.status(200).json({ status: "success" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: "error" });
    }
}
