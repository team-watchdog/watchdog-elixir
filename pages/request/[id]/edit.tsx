import { FunctionComponent } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// services
import RequestsService from "../../../shared/services/requests.service";

// types
import { Request } from "../../../shared/types";

// partials
import RequestForm from "../../../partials/RequestForm";

interface SingleRequestProps{
    request: Request;
}

const SingleRequest: FunctionComponent<SingleRequestProps> = (props) => {
    const { request } = props;

    const router = useRouter();

    return (
        <div>
            <main>
                <div className="container">
                    <div className="py-4">
                        <div className="border-b mb-4 py-2 border-zinc-200">
                            <h2 className="text-xl font-bold py-2">Update Request</h2>
                        </div>
                        <RequestForm 
                            request={request}
                            onSubmit={async (newRequest) => {
                                try {
                                    const resp = await axios.patch(`/api/requests/${request.id}`, newRequest);
                                    router.push(`/request/${request.id}`);
                                } catch (e) {
                                    console.log(e);
                                }
                                console.log(newRequest);
                            }}
                            buttonText="Update Request"
                        />
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