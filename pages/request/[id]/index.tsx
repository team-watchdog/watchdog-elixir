import { FunctionComponent } from "react";
import { NextPageContext } from 'next';

// services
import RequestsService from "../../../shared/services/requests.service";

// types
import { Request } from "../../../shared/types";

// partials
import { RequestFull } from "../../../partials/RequestFull";

interface SingleRequestProps{
    request: Request;
}

const SingleRequest: FunctionComponent<SingleRequestProps> = (props) => {
    const { request } = props;

    return (
        <div>
            <main>
                <div className="container">
                    <div className="py-4">
                        <RequestFull request={request} />
                    </div>
                </div>
            </main>
        </div>
    )
}

export const getServerSideProps = async ({ params } : { params: { id: string } }) => {
    let request;

    try {
        request = await RequestsService.GetRequest(params.id);
        console.log(request);
    } catch (e) {
        return e;
    }

    return {
        props: {
            request,
        }
    }
};

export default SingleRequest;