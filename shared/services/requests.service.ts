import { elasticClient } from "../../shared/clients/elastic";

export default class RequestsService{
    static async GetRequests(searchTerm: string = "", page: number = 0, limit: number = 10) {
        const query = searchTerm && searchTerm.length > 0? {
            multi_match: {
                query: searchTerm,
                minimum_should_match: 3,
                operator: "or",
                fuzziness: "AUTO",
                fuzzy_transpositions: true
            }
        } : undefined;

        const resp = await elasticClient.search({
            index: "requests",
            size: limit,
            from: page * limit,
            query,
            sort: [
                { 
                    createdAt : {
                        order : "desc", 
                        format : "strict_date_optional_time_nanos"
                    }
                },
            ]
        });

        const requestsResults = resp.hits.hits.map((hit: {_source: Request, _id: string }) => ({ ...hit._source, id: hit._id }));
        return {
            requestsResults, 
            count: resp.hits.total.value,
        }
    }

    static async GetRequest(id: string) {
        const document = await elasticClient.get({
            index: "requests",
            id: id,
        });

        if (document) return { ...document._source, id: document._id };
        return null;
    }
}