import { FunctionComponent } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// paritals
import HeadMeta from "../partials/HeadMeta";
import DrugForm from "../partials/DrugForm";

const BUCKET_URI = process.env.NEXT_PUBLIC_STATIC_BUCKET_URI;

const CreateRequest: FunctionComponent = () => {
    const router = useRouter();

    return (
        <div>
            <HeadMeta 
                title="Watchdog — An open source research collective."
                description="Watchdog is a multidisciplinary team of factcheckers, journalists, researchers and software engineers. We hunt hoaxes and misinformation, investigate matters of public welfare, and build software tools that help operations like ours."
                image={`${BUCKET_URI}/meta-blue.png`}
                imageAlt={"Watchdog logo"}
            />
            <main>
            <div className="container">
                <div className="py-4">
                    <h2 className="text-xl font-bold py-2">Add new drug</h2>
                    <DrugForm 
                        onSubmit={async (drug) => {
                            try {
                                const results = await axios.post("/api/newDrug", drug);
                                router.push("/drugs");
                            } catch (e) {
                                console.log(e);
                            }
                        }}
                    />
                </div>
            <div>
            </div>
            </div>
            </main>
        </div>
    )
}

export default CreateRequest;