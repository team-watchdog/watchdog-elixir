import { FunctionComponent, useState } from "react";
import { Modal, InputWrapper, Input, RadioGroup, Radio, Button, Title, Alert } from "@mantine/core";
import { Formik } from "formik";
import axios from "axios";

// types
import { CreateAccountInput, ErrorResponse } from "../shared/types";

const SIZE = "md";

interface NewAccountModalProps{
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const NewAccountModal: FunctionComponent<NewAccountModalProps> = (props) => {
    const { visible, onClose, onSuccess } = props;
    const [ errorTitle, setErrorTitle ] = useState<string | null>(null);
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);

    return (
        <Modal
          opened={visible}
          onClose={onClose}
          title={<Title order={4}>Create New Account</Title>}
          size={SIZE}
        >
            <Formik
                initialValues={{
                    type: "ORGANIZATION",
                } as CreateAccountInput}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true);
                    setErrorTitle(null);
                    setErrorMessage(null);   
                    try {
                        await axios.post("/api/admin/accounts", values);
                        if (onSuccess) onSuccess();
                    } catch (e) {
                        const tmp = e as ErrorResponse;
                        setErrorTitle(tmp.response.data.status);
                        setErrorMessage(tmp.response.data.message);
                    }
                    setSubmitting(false);
                }}
            >
                {({ values, setFieldValue, handleChange, submitForm, isSubmitting }) => (
                    <>
                        {errorTitle || errorMessage ? (
                            <Alert title={errorTitle} color="red" className="mb-4">
                                {errorMessage}
                            </Alert>
                        ) : null}
                        <InputWrapper
                            id="input-full-name"
                            required
                            label="Full Name"
                            className="pb-4"
                            size={SIZE}
                        >
                            <Input 
                                id="input-full-name" 
                                placeholder="Full Name" 
                                size={SIZE} 
                                type="text" 
                                name="full_name"
                                onChange={handleChange}
                                value={values.full_name}
                            />
                        </InputWrapper>
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
                                onChange={handleChange}
                                value={values.email}
                            />
                        </InputWrapper>
                        <RadioGroup
                            label="Select the account type"
                            required
                            size={SIZE}
                            className="pb-4"
                            value={values.type}
                            onChange={(value) => {
                                setFieldValue("type", value);
                            }}
                        >
                            <Radio value="ADMIN" label="Admin" size={SIZE} />
                            <Radio value="ORGANIZATION" label="Organization" size={SIZE} />
                        </RadioGroup>
                        <div className="py-2">
                            <Button className="bg-blue-3" size={SIZE} onMouseDown={submitForm} loading={isSubmitting}>Create Account</Button>
                        </div>
                    </>
                )}
            </Formik>
        </Modal>
    )
}

export default NewAccountModal;