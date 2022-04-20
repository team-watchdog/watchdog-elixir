import { FunctionComponent, useState } from "react";
import { InputWrapper, Input, Button, Title, Alert } from "@mantine/core";
import Cookies from "js-cookie";
import Link from "next/link";
import { NextPageContext } from "next";
import axios from "axios";
import { useRouter } from "next/router";
import { Formik } from "formik";

// types
import { SignInInput, ErrorResponse } from "../../shared";

// utils
import { getAuthUser, RequestWithCookie } from "../../middleware/utils";

const styles = {
    field: "flex flex-col gap-y-2 mb-4",
    label: "flex-1 font-semibold",
    input: "flex-1 px-4 py-2 border rounded-md border-zinc-300",
}

const SIZE = "md";

const SignIn: FunctionComponent = () => {
    const [ errorTitle, setErrorTitle ] = useState<string | null>(null);
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);

    const router = useRouter();

    return (
        <main>
            <div className="container">
                <div className="py-4">
                    <Title order={3}>Sign In</Title>
                    <Formik
                        initialValues={{

                        } as SignInInput}
                        onSubmit={async (values) => {
                            console.log(values);
                            try {
                                const resp = await axios.post("/api/auth/signin", values);
                                Cookies.set('token', resp.data.body.token);

                                router.push("/");
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
                                    id="input-email"
                                    required
                                    label="Email"
                                    className="pb-4"
                                    size={SIZE}
                                >
                                    <Input 
                                        id="input-email" 
                                        placeholder="Email" 
                                        name="email"
                                        size={SIZE} 
                                        type="email"
                                        onChange={handleChange} 
                                        value={values.email}
                                    />
                                </InputWrapper>
                                <InputWrapper
                                    id="input-email"
                                    required
                                    label="Password"
                                    className="pb-4"
                                    size={SIZE}
                                >
                                    <Input 
                                        id="input-password" 
                                        placeholder="Password" 
                                        name="password"
                                        size={SIZE} 
                                        type="password" 
                                        onChange={handleChange} 
                                        value={values.password}
                                    />
                                </InputWrapper>
                                <div className="py-2">
                                    <Button 
                                        variant="filled" 
                                        className="bg-blue-3" 
                                        size={SIZE} 
                                        type="submit"
                                        onMouseDown={submitForm}
                                    >Sign In</Button>
                                </div>
                                <InputWrapper className="py-2">
                                    <Link href="/auth/forgotPassword"><a href="" className="text-blue-1 font-semibold">Forgot Password?</a></Link>
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
            
        }
    }
}  

export default SignIn;