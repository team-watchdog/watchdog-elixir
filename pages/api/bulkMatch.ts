// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { chunk } from "lodash";

// services
import DrugService from "../../shared/services/drugs.service";

// types
import { DrugRequestItem, Equipment } from "../../shared/types";

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
    
    const drugs: DrugRequestItem[] = [];
    const equipments: Equipment[] = [];

    const chunks = chunk(body, 10);

    for (let chunk of chunks) {
        const promiseAll = [];

        for (let row of chunk) {
            promiseAll.push(DrugService.GetSearchResults((row as { item: string }).item));
        }

        try {
            const results = await Promise.all(promiseAll);

            for (let i = 0; i < body.length; i += 1) {
                console.log(body[i].item);
                if (results[i].length > 0) {
                    drugs.push({
                        drug: results[i][0],
                        quantity: body[i].quantity ? parseInt(body[i].quantity) : undefined,
                    });
                } else {
                    equipments.push({
                        itemName: body[i].item,
                        quantity: body[i].quantity ? parseInt(body[i].quantity) : undefined,
                        itemDescription: undefined,
                    })
                }
            }
        } catch (e) {
            console.log(e);
        }
    }    

    res.status(200).json({ 
        status: "success",
        results: {
            drugItems: drugs,
            equipments: equipments,
        }
    });
}
