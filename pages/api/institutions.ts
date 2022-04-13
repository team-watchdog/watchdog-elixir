// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { elasticClient } from "../../shared/clients/elastic";

// types
import { Institution } from "../../shared/types";

type Data = {
  status: unknown,
  results?: Institution[],
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.method !== "POST") res.status(406).json({ status: "invalid" });
    const searchTerm = req.body && req.body.searchTerm ? req.body.searchTerm : "";

    const resp = await elasticClient.search({
        index: 'institutions',
        query: {
            multi_match: {
                query: searchTerm,
                fields: ["name", "type1","type2"],
                type: "most_fields",
                fuzziness: "AUTO",
                fuzzy_transpositions: true
            }
        }
    });

    const institutionResults = resp.hits.hits.map((hit: {_source: Institution, _id: string }) => ({ ...hit._source, id: hit._id }));
    res.status(200).json({ status: "success", results: institutionResults })
}
