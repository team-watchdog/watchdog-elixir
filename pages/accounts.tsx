import { useState } from 'react';
import { NextPageContext } from 'next';
import { Table, ActionIcon } from '@mantine/core';
import { useRouter } from 'next/router';

// icon
import { TrashIcon } from "@heroicons/react/outline";

// containers
import NewAccountModal from "../containers/NewAccountModal";

// partials
import HeadMeta from "../partials/HeadMeta";

// services
import AdminHandlers from "../services/admin.service";

// types
import { SanitizedAccount } from "../shared/types";

// utils
import { getAuthUser, RequestWithCookie } from '../middleware/utils';

const BUCKET_URI = process.env.NEXT_PUBLIC_STATIC_BUCKET_URI;

interface ChangeListener{
    target: {
        value: string
    }
}

interface AccountsProps {
  accounts: SanitizedAccount[];
}

const Accounts = (props: AccountsProps) => {
  const { accounts } = props;
  const [ showCreateAccountModal , setShowCreateAccountModal ] = useState(false);
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
          <div className="py-4 mt-2 border-b border-zinc-200 flex justify-between items-center">
            <h2 className="text-xl font-bold">Accounts</h2>
            <a href="/newDrug" className="py-2 px-4 bg-zinc-700 text-white rounded-md" onMouseDown={() => setShowCreateAccountModal(true)}>New Account</a>
          </div>
          <div>
            <Table className="w-full" fontSize={16}>
                <thead className="w-full">
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th></th>
                </thead>
                <tbody>
                    {accounts.map((item, i) => (
                        <tr key={i} className="break-inside-avoid">
                            <td className="align-top">
                              {item.full_name}
                            </td>
                            <td className="align-top">{item.email}</td>
                            <td className="align-top">{item.type}</td>
                            <td>
                              <ActionIcon
                                onMouseDown={() => {
                                  
                                }}
                              >
                                <TrashIcon />
                              </ActionIcon>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
          </div>
        </div>
      </main>
      <NewAccountModal 
        visible={showCreateAccountModal}
        onClose={() => {
          setShowCreateAccountModal(false);
        }}
        onSuccess={() => {
          router.reload();
        }}
      />
    </div>
  )
}

export const getServerSideProps = async ({ req, query }: NextPageContext) => {
    const account = getAuthUser(req as RequestWithCookie);
    if (!account || account.type !== "ADMIN") {
        return {
            redirect: {
                destination: `/`,
                permanent: false,
            },
          }
    }

    let accounts;

    try {
        accounts = await AdminHandlers.GetAccounts();
    } catch (e) {
        throw e;
    }

    return {
        props: {
          account,
          accounts: accounts.map((account) => ({...account, created_at: account.created_at.toISOString(), last_updated_at: account.last_updated_at.toISOString() })),
        }
    }
}


export default Accounts;
