import { FunctionComponent } from "react";
import { NextPageContext } from 'next';

// services
import PledgesService from "../../../shared/services/pledges.service";

// types
import { Pledge, Account } from "../../../shared/types";

// partials
import { PledgeFull } from "../../../partials/PledgeFull";

// utils
import { RequestWithCookie, getAuthUser } from "../../../middleware/utils";

interface SingleRequestProps{
    pledge: Pledge;
    account: Account | null;
}

const SingleRequest: FunctionComponent<SingleRequestProps> = (props) => {
    const { pledge, account } = props;

    return (
        <div>
            <main>
                <div className="container">
                    <div className="py-4">
                        <PledgeFull pledge={pledge} account={account} />
                    </div>
                </div>
            </main>
        </div>
    )
}

export const getServerSideProps = async ({ req, params } : { req: RequestWithCookie, params: { id: string } }) => {
    const account = getAuthUser(req as RequestWithCookie);
    
    let pledge;

    try {
        const tmpPledge = await PledgesService.GetPledge(params.id);
        pledge = {
            ...tmpPledge,
            phoneNumber: account && tmpPledge.phoneNumber ? tmpPledge.phoneNumber :"********",
            email: account && tmpPledge.email ? tmpPledge.email: "*********",
        }
    } catch (e) {
        return e;
    }

    return {
        props: {
            pledge,
            account,
        }
    }
};

export default SingleRequest;