// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { elasticClient } from "../../../shared/clients/elastic";

// services
import EquipmentsService from '../../../shared/services/equipments.service';

// types
import { EquipmentResult } from "../../../shared/types";

type Data = {
  status: unknown,
  results?: EquipmentResult[],
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.method !== "POST") {
        res.status(406).json({ status: "invalid" });
    }
    const searchTerm = req.body && req.body.searchTerm ? req.body.searchTerm : "";

    const equipmentResults = await EquipmentsService.GetSearchResults(searchTerm);
    res.status(200).json({ status: "success", results: equipmentResults });
}
