// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { elasticClient } from "../../../shared/clients/elastic";

type Data = {
  status: unknown,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.method === "DELETE") {
      try {
        const resp = await elasticClient.delete({
            index: 'requests',
            id: req.query.id,
        });
        await elasticClient.indices.refresh({ index: "requests" });

        return res.status(200).json({ status: "success" });
      } catch (e) {
        console.log(e);
        res.status(500).json({ status: "internal error" });
      }
      
    }

    res.status(404).json({ status: "failed" });
}
