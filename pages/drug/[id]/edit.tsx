import { FunctionComponent } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// services
import RequestsService from "../../../shared/services/requests.service";

// types
import { Drug } from "../../../shared/types";

// partials
import DrugForm from "../../../partials/DrugForm";
import DrugService from "../../../shared/services/drugs.service";

// utils
import { getAuthUser, RequestWithCookie } from '../../../middleware/utils';

interface SingleDrugProps{
    drug: Drug;
}

const SingleDrug: FunctionComponent<SingleDrugProps> = (props) => {
    const { drug } = props;

    const router = useRouter();

    return (
        <div>
            <main>
                <div className="container">
                    <div className="py-4">
                        <div className="border-b mb-4 py-2 border-zinc-200">
                            <h2 className="text-xl font-bold py-2">Update Drug</h2>
                        </div>
                        <DrugForm 
                            drug={drug}
                            onSubmit={async (newDrug) => {
                                try {
                                    const resp = await axios.patch(`/api/drugs/${drug.id}`, newDrug);
                                    router.push(`/drugs`);
                                } catch (e) {
                                    console.log(e);
                                }
                                console.log(newDrug);
                            }}
                            buttonText="Update Drug"
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}

export const getServerSideProps = async ({ params, req } : { params: { id: string }, req: RequestsService }) => {
    const account = getAuthUser(req as RequestWithCookie);
    if (!account) {
        return {
            redirect: {
                destination: `/`,
                permanent: false,
            },
          }
    }

    let drug;
    
    try {
        drug = await DrugService.GetDrug(params.id);
        console.log(drug);
    } catch (e) {
        return e;
    }

    return {
        props: {
            drug,
        }
    }
};

export default SingleDrug;