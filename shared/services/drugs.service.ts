import { elasticClient } from "../../shared/clients/elastic";

// types
import { Drug } from "../types";

export default class DrugService{
    static async GetSearchResults(searchTerm: string = "") {
        const parseSearchTerm = (term: string): string => {
            const comps = term.split(/(\d*\s)/ig);

            let str = "";

            for (let comp of comps) {
                if (comp.match(/^\d*\s/)) {
                    str += comp.replace(/\s/ig, "");
                } else {
                    str += comp;
                    if (!comp.match(/\.$/)) str += " ";
                }
            }
            return str.replace(/\s$/, "");
        }

        const tmpSearchTerm = parseSearchTerm(searchTerm);
        let firstWord = tmpSearchTerm.split(" ").length > 0 ? tmpSearchTerm.split(" ")[0] : "";

        console.log(tmpSearchTerm);

        //console.log(`${tmpSearchTerm} => ${firstWord}`);

        const resp = await elasticClient.search({
            index: 'drugs',
            sort: {
                _score: {
                    order: "desc",
                },
            },
            query: {
                bool: {
                    must: [
                    ],
                    should: [
                        {
                            multi_match: {
                                type: "best_fields",
                                query: tmpSearchTerm,
                                fields: ["genericName", "brandName"],
                            }
                        },
                        {
                          multi_match: {
                            query: firstWord,
                            type: "best_fields",
                            fields: ["genericName", "brandName"],
                            fuzziness: "AUTO",
                            fuzzy_transpositions: true
                          }
                        },
                        {
                            multi_match: {
                                query: tmpSearchTerm,
                                type: "best_fields",
                                fields: ["aliases"],
                                fuzziness: "AUTO",
                                fuzzy_transpositions: true
                            }
                        }
                    ],
                }
            }
        });

        //console.log(resp);

        const drugResults = resp.hits.hits.map((hit: {_source: Drug, _id: string, _score: number }) => ({ ...hit._source, id: hit._id, score: hit._score }));
        return drugResults;
    }

    static async GetDrug(id: string) {
        const document = await elasticClient.get({
            index: "drugs",
            id: id,
        });

        if (document) return { ...document._source, id: document._id };
        return null;
    }
}