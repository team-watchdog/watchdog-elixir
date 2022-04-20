import { FunctionComponent, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import Loading from "../../partials/Loading";

const SignOut: FunctionComponent = () => {
    const router = useRouter();
    useEffect(() => {
        Cookies.remove("token");
        router.push("/");
    }, [])
    return(
        <div className="py-10">
            <Loading />
        </div>
    )
}

export default SignOut;