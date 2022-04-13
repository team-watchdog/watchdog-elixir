import { useState, useEffect } from 'react';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';

// partials
import HeadMeta from "../partials/HeadMeta";
import { RequestItem } from "../partials/RequestItem";
import { Pagination } from "../partials/Pagination";

// services
import RequestsService from "../shared/services/requests.service";

// types
import { Request } from "../shared/types";

const BUCKET_URI = process.env.NEXT_PUBLIC_STATIC_BUCKET_URI;

interface HomeProps {
  requests: Request[];
  count: number;
  page: number;
  limit: number;
  searchTerm: string;
}

const Home = (props: HomeProps) => {
  const { requests, count, page, limit, searchTerm } = props;

  const [ term, setTerm ] = useState(searchTerm);
  const router = useRouter();

  useEffect(() => {
    setTerm(searchTerm);
  }, [ searchTerm ]);

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
          <div className="py-4 mt-2 border-b border-zinc-200 flex justify-between items-center">
            <h2 className="text-xl font-bold">Requests</h2>
            <a href="/createRequest" className="py-2 px-4 bg-zinc-700 text-white rounded-md">New Request</a>
          </div>
          <div className="flex py-4">
            <form 
              className="flex flex-1"
              onSubmit={(e) => { 
                router.push({
                  search: `searchTerm=${term}`,
                })
                e.preventDefault();
              }}
            >
              <input 
                type="search" 
                placeholder="Search for requests" 
                className="flex-1 px-4 py-2 border rounded-md border-zinc-300"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
            </form>
          </div>
          <div className="divide-y divide-zinc-200">
            {requests.map((request, i) => (
              <RequestItem key={i} request={request} />
            ))}
          </div>
          <div className="py-2">
            <Pagination 
              page={page}
              limit={limit}
              count={count}
              searchTerm={searchTerm}
            />
          </div>
         <div>
         </div>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps = async ({ query }: NextPageContext) => {
  const page = query && query.page ? parseInt(query.page as string) : 0;
  const limit = query && query.limit ? parseInt(query.limit as string) : 10;
  const searchTerm = query && query.searchTerm ? query.searchTerm as string: "";

  let resp;

  try {
    resp = await RequestsService.GetRequests(searchTerm, page, limit);
  } catch (e) {
    console.log(e);
  }
  
  return {
    props: {
      requests: resp?.requestsResults,
      count: resp?.count,
      page,
      limit,
      searchTerm,
    }
  }
}

export default Home;
