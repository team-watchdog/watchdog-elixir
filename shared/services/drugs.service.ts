import { elasticClient } from "../../shared/clients/elastic";

// types
import { Drug } from "../types";

export default class DrugService{
    static async GetSearchResults(searchTerm: string = "") {
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
        return drugResults;
    }
}