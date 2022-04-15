import { elasticClient } from "../../shared/clients/elastic";

// types
import { Drug } from "../types";

export default class EquipmentsService{
    static async GetSearchResults(searchTerm: string = "") {
        const resp = await elasticClient.search({
            index: 'equipments',
            sort: {
                _score: {
                    order: "desc",
                },
            },
            query: {
                bool: {
                    must: [
                        {
                            multi_match: {
                                type: "best_fields",
                                query: searchTerm,
                                fields: ["item"],
                            }
                        }
                    ],
                    should: [],
                }
            }
        });
        const equipmentsResults = resp.hits.hits.map((hit: {_source: Drug, _id: string, _score: number }) => ({ ...hit._source, id: hit._id, score: hit._score }));
        return equipmentsResults;
    }
}