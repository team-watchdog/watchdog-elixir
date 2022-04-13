import { FunctionComponent } from "react";
import Lottie from "lottie-react";

import { LoadingLottie } from "../public/LoadingLottie";

const Loading: FunctionComponent = () => {
    return (
        <div className="items-center justify-center flex">
            <div className="w-60 h-60 flex justify-center items-center">
                <Lottie animationData={LoadingLottie} loop autoPlay />
            </div>
        </div>
    );
}

export default Loading;