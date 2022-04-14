// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { elasticClient } from "../../shared/clients/elastic";

// types
import { Drug } from "../../shared/types";

type Data = {
  status: unknown,
  results?: Drug[],
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.method !== "POST") res.status(406).json({ status: "invalid" });
    const searchTerm = req.body && req.body.searchTerm ? req.body.searchTerm : "";

    const resp = await elasticClient.search({
        index: 'drugs',
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  type: "best_fields",
                  query: searchTerm,
                  fields: ["genericName", "brandName"],
                  lenient: true
                }
              }
            ],
            should: [
              {
                multi_match: {
                  query: searchTerm,
                  minimum_should_match: 3,
                  fields: ["genericName", "brandName"],
                  operator: "or",
                  fuzziness: "AUTO",
                  fuzzy_transpositions: true
                }
              }
            ]
          }
        }
    });

    const drugResults = resp.hits.hits.map((hit: {_source: Drug, _id: string }) => ({ ...hit._source, id: hit._id }));

    res.status(200).json({ status: "success", results: drugResults });
}
