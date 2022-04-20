import { FunctionComponent } from "react";
import { NextPageContext } from 'next';

// services
import RequestsService from "../../../shared/services/requests.service";

// types
import { Request, Account } from "../../../shared/types";

// partials
import { RequestFull } from "../../../partials/RequestFull";

// utils
import { RequestWithCookie, getAuthUser } from "../../../middleware/utils";

interface SingleRequestProps{
    request: Request;
    account: Account | null;
}

const SingleRequest: FunctionComponent<SingleRequestProps> = (props) => {
    const { request, account } = props;

    return (
        <div>
            <main>
                <div className="container">
                    <div className="py-4">
                        <RequestFull request={request} account={account} />
                    </div>
                </div>
            </main>
        </div>
    )
}

export const getServerSideProps = async ({ req, params } : { req: RequestWithCookie, params: { id: string } }) => {
    const account = getAuthUser(req as RequestWithCookie);
    
    let request;

    try {
        const tmpRequest = await RequestsService.GetRequest(params.id);

        request = {
            ...tmpRequest,
            name: "*****",
            contactNumber: "********",
        }
    } catch (e) {
        return e;
    }

    return {
        props: {
            request,
            account,
        }
    }
};

export default SingleRequest;