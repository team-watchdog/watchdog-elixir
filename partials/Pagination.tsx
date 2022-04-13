import Link from "next/link";
import { FunctionComponent } from "react";

interface PaginationProps{
    count: number;
    limit: number;
    page: number;
    searchTerm: string;
}

export const Pagination: FunctionComponent<PaginationProps> = (props) => {
    const { count, limit, page, searchTerm } = props;

    const numPages = Math.ceil(count / limit);
    const pages = [];

    for (let i = 0; i < numPages; i += 1) pages.push(i);

    return (
        <div className="flex flex-row gap-x-1">
            {pages.map((cur, i) => (
                <Link href={{
                    pathname: "",
                    query: {
                        searchTerm,
                        page: cur,
                        limit,
                    }
                }}>
                    <a className={`py-2 px-2 border ${cur === page ? "border-blue-0" : "border-zinc-300"} rounded-md ${cur === page ? "text-white bg-blue-1" : "text-zinc-700"}`}>{cur + 1}</a>
                </Link>
            ))}
        </div>
    )
}

/*

            <a href="" className="py-2 px-2 border border-zinc-300 rounded-md text-zinc-700">1</a>
            <a href="" className="py-2 px-2 border border-zinc-300 rounded-md text-zinc-700">2</a>
            <a href="" className="py-2 px-2 border border-blue-0 rounded-md text-white bg-blue-1">3</a>
*/