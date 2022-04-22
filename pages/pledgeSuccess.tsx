import { FunctionComponent } from "react";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

import { Button } from "../partials/Button";

const PledgeSuccess: FunctionComponent = () => {
    const router = useRouter();

    return (
        <main>
            <div className="container">
                <div className="py-10">
                    <CheckCircleIcon color="#38BCA4" width={80} height={80} className="mb-8" />
                    <h3 className="text-2xl font-bold">Pledge submitted succesfully!</h3>
                    <p className="py-2">Thank you for reaching out in this critical time! We have forwarded your pledge to our partner organizations, and they will reach out to you and coordinate the next steps. In the meantime, read our article on how to contribute during this crisis here: <a href="" className="text-blue-1 font-semibold">How to donate to the Sri Lankan medical crisis.</a></p>
                    <p className="py-2">Share this with people who can help. </p>
                    <p>Thank you,</p>
                    <p>Team Watchdog</p>
                    <div className="py-6">
                        <Button
                            type="primary"
                            label={"Go back home"}
                            onMouseDown={() => {
                                router.push("/");
                            }}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default PledgeSuccess;