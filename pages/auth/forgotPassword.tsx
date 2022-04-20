import { FunctionComponent, useState } from "react";
import { InputWrapper, Input, Button, Title, Alert } from "@mantine/core";
import axios from "axios";
import Link from "next/link";

import { Formik } from "formik";

// types
import { ErrorResponse } from "../../shared";

const styles = {
    field: "flex flex-col gap-y-2 mb-4",
    label: "flex-1 font-semibold",
    input: "flex-1 px-4 py-2 border rounded-md border-zinc-300",
}

const SIZE = "md";

const SignIn: FunctionComponent = () => {
    const [ errorTitle, setErrorTitle ] = useState<string | null>(null);
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);

    const [ success, setSuccess ] = useState(false); 

    return (
        <main>
            <div className="container">
                <div className="py-4">
                    <Title order={3}>Forgot Password</Title>
                    <Formik
                        initialValues={{
                            email: "",
                        }}
                        onSubmit={async (values) => {
                            console.log(values);
                            try {
                                await axios.post("/api/auth/forgotpassword", {
                                    email: values.email,
                                });
                                setSuccess(true);

                                setErrorTitle(null);
                                setErrorMessage(null);
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
                                {success ? (
                                    <Alert title="Success" color="green" className="mb-4">
                                        Password reset link has been sent to your email
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
                                        size={SIZE} 
                                        type="email" 
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                    />
                                </InputWrapper>
                                <div className="py-2">
                                    <Button 
                                        variant="filled" 
                                        className="bg-blue-3" 
                                        size={SIZE} 
                                        type="submit"
                                        onMouseDown={submitForm}
                                    >Forgot Password</Button>
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

export default SignIn;