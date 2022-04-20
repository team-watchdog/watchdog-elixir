import { useState, FunctionComponent } from "react";
import { InputWrapper, Input, Button, Title, Alert } from "@mantine/core";
import { NextPageContext } from 'next';
import { useRouter } from "next/router";
import Link from "next/link";
import { Formik } from "formik";
import axios from "axios";

// types
import { ErrorResponse } from "../../shared";

// utils
import { getAuthUser, RequestWithCookie } from "../../middleware/utils";

const styles = {
    field: "flex flex-col gap-y-2 mb-4",
    label: "flex-1 font-semibold",
    input: "flex-1 px-4 py-2 border rounded-md border-zinc-300",
}

const SIZE = "md";

interface ResetPasswordProps{
    resetToken: string;
    accountId: number;
}

const ResetPassword: FunctionComponent<ResetPasswordProps> = (props) => {
    const { resetToken, accountId } = props;

    const [ errorTitle, setErrorTitle ] = useState<string | null>(null);
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);

    const router = useRouter();

    return (
        <main>
            <div className="container">
                <div className="py-4">
                    <Title order={3}>Set a new password</Title>
                    <Formik
                        initialValues={{
                            newPassword: "",
                        }}
                        onSubmit={async (values) => {
                            console.log(values);
                            try {
                                await axios.post("/api/auth/resetpassword", {
                                    newPassword: values.newPassword,
                                    accountId,
                                    resetToken,
                                });
                                router.push("/auth/signin");
                            } catch (e) {
                                const tmp = e as ErrorResponse;
                                setErrorTitle(tmp.response.data.status);
                                setErrorMessage(tmp.response.data.message);
                            }
                        }}
                    >
                        {({ values, handleChange, submitForm }) => (
                            <div className="py-4">
                                {errorTitle || errorMessage ? (
                                    <Alert title={errorTitle} color="red" className="mb-4">
                                        {errorMessage}
                                    </Alert>
                                ) : null}
                                <InputWrapper
                                    id="input-password"
                                    required
                                    label="New Password"
                                    className="pb-4"
                                    size={SIZE}
                                >
                                    <Input 
                                        id="input-password"
                                        placeholder="Password" 
                                        size={SIZE}
                                        type="password" 
                                        name="newPassword"
                                        onChange={handleChange}
                                        value={values.newPassword}
                                    />
                                </InputWrapper>
                                <div className="py-2">
                                    <Button 
                                        variant="filled" 
                                        className="bg-blue-3" 
                                        size={SIZE} 
                                        type="submit"
                                        onMouseDown={submitForm}
                                    >Update Password</Button>
                                </div>
                                <InputWrapper className="py-2">
                                    <Link href="/auth/signin"><a href="" className="text-blue-1 font-semibold">Sign in instead</a></Link>
                                </InputWrapper>
                            </div>
                        )}
                    </Formik>
                </div>
            </div>
        </main>
    )
}

export const getServerSideProps = async ({ req, query }: NextPageContext) => {
  const resetToken = query && query.resetToken ? query.resetToken as string: "";
  const accountId = query && query.accountId ? parseInt(query.accountId as string) : null;

  if (!resetToken || resetToken.length === 0 || !accountId) {
      return {
        redirect: {
            destination: '/auth/signin',
            permanent: false,
        },
      }
  }
  const account = getAuthUser(req as RequestWithCookie);
  if (account) {
    return {
        redirect: {
            destination: '/',
            permanent: false,
        },
    }
  }

  return {
      props: {
          resetToken,
          accountId,
      }
  }
}

export default ResetPassword;