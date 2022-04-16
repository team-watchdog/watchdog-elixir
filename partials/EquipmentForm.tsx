import axios from "axios";
import { FunctionComponent } from "react";
import { Formik, FormikErrors } from "formik";
import { parse } from 'csv-parse/browser/esm/sync';

// partials
import { Button } from "./Button";

// types
import { EquipmentResult } from "../shared/types";

const styles = {
    field: "flex flex-col gap-y-2 mb-4",
    label: "flex-1 font-semibold",
    input: "flex-1 px-4 py-2 border rounded-md border-zinc-300",
}

interface EquipmentFormProps{
    onSubmit: (equipment: EquipmentResult) => Promise<void>;
    equipment?: EquipmentResult;
    buttonText?: string;
}

interface EquipmentFormikForm extends EquipmentResult{
    newAliasName: string;
}

const EquipmentForm: FunctionComponent<EquipmentFormProps> = (props) => {
    const { equipment, onSubmit, buttonText } = props;

    const initialValues = equipment ? equipment as EquipmentFormikForm : {
        importer: {
            id: "",
            name: "",
        },
        newAliasName: "",
    } as EquipmentFormikForm;

    return (
        <div className="flex flex-1">
        <Formik
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                await onSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, setFieldValue, handleChange, isSubmitting, submitForm }) => (
                <div className="flex-1 py-2">
                    <div>
                        <div className={styles.field}>
                            <label className={styles.label}>Item Name</label>
                            <input className={styles.input} type="text" name="item" onChange={handleChange} value={values.item} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Unit</label>
                            <input className={styles.input} type="text" name="unit" onChange={handleChange} value={values.unit} />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Importer ID</label>
                            <input className={styles.input} type="text" name="importer.id" onChange={handleChange} value={values.importer.id ? values.importer.id : undefined} />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Importer Name</label>
                            <input className={styles.input} type="text" name="importer.name" onChange={handleChange} value={values.importer.name ? values.importer.name : undefined} />
                        </div>
                    </div>
                    <div className="py-4">
                        <Button 
                            type="primary"
                            label={buttonText ? buttonText : "Add Equipment"}
                            disabled={isSubmitting}
                            onMouseDown={() => {
                                submitForm();
                            }}
                        />
                    </div>
                </div>
            )} 
        </Formik>
        </div>
    );
}

export default EquipmentForm;