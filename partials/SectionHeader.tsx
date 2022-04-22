import { FunctionComponent, ReactElement } from "react";

interface SectionHeaderProps{
    Left?: ReactElement;
    Right?: ReactElement;
}

const SectionHeader: FunctionComponent<SectionHeaderProps> = (props) => {
    const { Left, Right } = props;

    return (
        <div className="pt-6 pb-2 border-b border-b-slate-200 text-sky-800 flex flex-row justify-between items-center">
            <div>
                <h2 className="text-xl font-bold">{Left ? Left : null}</h2>
            </div>
            <div>{Right ? Right : null}</div>
        </div>
    );
}

export default SectionHeader;