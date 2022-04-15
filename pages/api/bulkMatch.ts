// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { chunk } from "lodash";

// services
import DrugService from "../../shared/services/drugs.service";

// types
import { DrugRequestItem, Equipment } from "../../shared/types";
import EquipmentsService from "../../shared/services/equipments.service";

type Data = {
  status: unknown,
  results?: unknown,
}

type RawRequest = {
    quantity?: number | string;
    item: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.method !== "POST" || !req.body) res.status(406).json({ status: "invalid" });
    let body = req.body as RawRequest[];
    
    for (let i = 0; i < body.length; i += 1) {
        body[i].quantity = body[i].quantity ? parseInt(body[i].quantity as string) : undefined;
    }
    
    const drugs: DrugRequestItem[] = [];
    const equipments: Equipment[] = [];

    const chunks = chunk(body, 5);

    for (let chunk of chunks) {
        const promiseAllDrugs = [];
        const promiseAllEquips = [];

        for (let row of chunk) {
            promiseAllDrugs.push(DrugService.GetSearchResults((row as { item: string }).item));
            promiseAllEquips.push(EquipmentsService.GetSearchResults((row as { item: string }).item));
        }

        try {
            const resultsDrugs = await Promise.all(promiseAllDrugs);
            const resultsEquips = await Promise.all(promiseAllEquips);

            for (let i = 0; i < chunk.length; i += 1) {
                if (resultsDrugs[i].length > 0) {
                    if (resultsEquips[i].length > 0 && resultsEquips[i][0].score > resultsDrugs[i][0].score) {
                        // equipment match is better than drug match
                        console.log(`${chunk[i].item},${(resultsEquips[i][0]).item},${chunk[i].quantity},EQUIP,${(resultsEquips[i][0]).score}`);

                        equipments.push({
                            itemName: resultsEquips[i][0].item,
                            quantity: chunk[i].quantity ? chunk[i].quantity as number : undefined,
                            itemDescription: `ORIGINAL: ${chunk[i].item} ${resultsEquips[i][0].id} — ${resultsEquips[i][0].importer.name}`,
                        });
                    } else {
                        // drug match is better
                        console.log(`${chunk[i].item},${(resultsDrugs[i][0]).genericName},${chunk[i].quantity},DRUG,${(resultsDrugs[i][0]).score}`);
                        drugs.push({
                            drug: resultsDrugs[i][0],
                            quantity: chunk[i].quantity ? chunk[i].quantity as number: undefined,
                            originalText: chunk[i].item,
                        });
                    }
                } else {
                    if (resultsEquips[i].length > 0) {
                        console.log(`${chunk[i].item},${(resultsEquips[i][0]).item},${chunk[i].quantity},EQUIP,${(resultsEquips[i][0]).score}`);

                        equipments.push({
                            itemName: resultsEquips[i][0].item,
                            quantity: chunk[i].quantity ? chunk[i].quantity as number : undefined,
                            itemDescription: `ORIGINAL: ${chunk[i].item} ${resultsEquips[i][0].id} — ${resultsEquips[i][0].importer.name}`,
                        });
                    } else {
                        console.log(`${chunk[i].item},NOT_FOUND,${chunk[i].quantity},EQUIP,NOT FOUND`);
                        equipments.push({
                            itemName: chunk[i].item,
                            quantity: chunk[i].quantity ? chunk[i].quantity as number : undefined,
                            itemDescription: `ORIGINAL: ${chunk[i].item}`,
                        });
                    }
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
