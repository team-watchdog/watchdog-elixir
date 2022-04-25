import { FunctionComponent, useState } from "react";
import { NextPageContext } from "next";
import { useRouter } from "next/router";

// types
import { Pledge } from "../shared";

// utils
import { getAuthUser, RequestWithCookie, SignedPayload } from '../middleware/utils';

// partials
import SectionHeader from "../partials/SectionHeader";
import { PledgeItem } from "../partials/PledgeItem";
import { Pagination } from "../partials/Pagination";

// services
import PledgesService from "../shared/services/pledges.service";

interface PledgesProps{
    pledges: Pledge[];
    account: SignedPayload | null;
    count: number;
    limit: number;
    page: number;
    searchTerm: string;
}

const Pledges: FunctionComponent<PledgesProps> = (props) => {
    const { pledges, account, count, page, limit, searchTerm } = props;
    const router = useRouter();

    const [ term, setTerm ] = useState(searchTerm);
    

    return (
        <main>
            <div className="container">
                <SectionHeader 
                    Left={(<>Pledges</>)}
                />
                <div className="flex py-4">
                    <form 
                    className="flex flex-1"
                    onSubmit={(e) => { 
                        router.push({
                            search: `searchTerm=${term}`,
                        })
                        e.preventDefault();
                    }}
                    >
                    <input 
                        type="search" 
                        placeholder="Search for pledges" 
                        className="flex-1 px-4 py-2 border rounded-md border-zinc-300"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                    />
                    </form>
                </div>
                <div className="divide-y divide-zinc-200">
                    {pledges.map((pledge, i) => (
                        <PledgeItem pledge={pledge} key={i} />
                    ))}
                </div>
                <div className="py-2">
                    <Pagination 
                        page={page}
                        limit={limit}
                        count={count}
                        searchTerm={searchTerm}
                    />
                </div>
            </div>
        </main>
    )
}

export const getServerSideProps = async ({ req, query }: NextPageContext) => {
    const account = getAuthUser(req as RequestWithCookie);
    let pledges: Pledge[] = [];

    const page = query && query.page ? parseInt(query.page as string) : 0;
    const limit = query && query.limit ? parseInt(query.limit as string) : 10;
    const searchTerm = query && query.searchTerm ? query.searchTerm as string: "";

    const resp = await PledgesService.GetPledges(searchTerm);

    if (resp) {
        pledges = resp.pledgesResults;
    }

    return {
        props: {
            account,
            pledges,
            count: resp?.count,
            page,
            limit,
            searchTerm,
        }
    }
}

export default Pledges;