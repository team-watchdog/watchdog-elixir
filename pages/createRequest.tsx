import { FunctionComponent } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// paritals
import HeadMeta from "../partials/HeadMeta";
import RequestForm from "../partials/RequestForm";

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
                    <h2 className="text-xl font-bold py-2">Submit Drug and Medical Equipment Request</h2>
                    <div className="border-b mb-4 py-2 border-zinc-200">
                        <p className="mb-2 font-medium">This form is ONLY for medical professionals. Please DO NOT fill this out if you're not an active duty doctor or nurse. We will contact you to verify and to get more details.</p>
                        <p className="mb-2 font-medium">Please contact @teamwatchdog across all social media networks if you have any further inqueries.</p>
                    </div>
                    <RequestForm 
                        onSubmit={async (request) => {
                            try {
                                const results = await axios.post("/api/createRequest", request);
                                router.push("/");
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