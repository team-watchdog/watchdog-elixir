import axios from "axios";
import { FunctionComponent } from "react";
import { Formik, FormikErrors } from "formik";
import { parse } from 'csv-parse/browser/esm/sync';

// partials
import DrugSearch from "./DrugSearch";
import InstitutionSearch from "./InstitutionSearch";
import { Button } from "./Button";

// types
import { Drug } from "../shared/types";

const styles = {
    field: "flex flex-col gap-y-2 mb-4",
    label: "flex-1 font-semibold",
    input: "flex-1 px-4 py-2 border rounded-md border-zinc-300",
}

interface DrugFormProps{
    onSubmit: (drug: Drug) => Promise<void>;
    drug?: Drug;
    buttonText?: string;
}

interface DrugFormikForm extends Drug{
    newAliasName: string;
}

const DrugForm: FunctionComponent<DrugFormProps> = (props) => {
    const { drug, onSubmit, buttonText } = props;

    const initialValues = drug ? drug as DrugFormikForm : {
        importer: {
            id: "",
            name: "",
        },
        newAliasName: "",
    } as DrugFormikForm;

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
                            <label className={styles.label}>Generic Name</label>
                            <input className={styles.input} type="text" name="genericName" onChange={handleChange} value={values.genericName} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Brand Name</label>
                            <input className={styles.input} type="text" name="brandName" onChange={handleChange} value={values.brandName} />
                        </div>
                        
                        <div className="flex-row py-4">
                            <h3 className="font-semibold text-lg py-2">Aliases</h3>
                            {values.aliases && values.aliases.length > 0 ? (
                                <table className="table-auto w-full">
                                    <thead className="w-full">
                                        <tr>
                                            <th>Alias</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {values.aliases.map((alias, i) => (
                                            <tr key={i}>
                                                <td className="align-top">
                                                    <b>{alias}</b>
                                                </td>
                                                <td className="align-top">
                                                    <button 
                                                        className="p-2 bg-rating-red text-sm text-white rounded-md"
                                                        onMouseDown={() => {
                                                            if (values.aliases) {
                                                                const updatedList = [
                                                                    ...values.aliases.slice(0, i),
                                                                    ...values.aliases.slice(i + 1, values.aliases.length),
                                                                ];
                                                                setFieldValue("aliases", updatedList);
                                                            }
                                                        }}
                                                    >Remove</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : null}
                            <div className="py-4 px-4 bg-zinc-100 rounded-md mt-4">
                                <div className={styles.field}>
                                    <label className={styles.label}>Item name</label>
                                    <input 
                                        className={styles.input} 
                                        type="text" 
                                        placeholder="Add an alias for the drug" 
                                        value={values.newAliasName}
                                        onChange={handleChange}
                                        name="newAliasName"
                                    />
                                </div>
                                <button 
                                    className="py-2 px-2 text-white rounded-md bg-zinc-700"
                                    onMouseDown={() => {
                                        const newArr = [...(values.aliases ? values.aliases : []), values.newAliasName];
                                        setFieldValue("aliases", newArr);
                                        setFieldValue("newAliasName", "");
                                    }}
                                    disabled={!values.newAliasName}
                                >
                                    Add Alias
                                </button>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Schedule</label>
                            <input className={styles.input} type="text" name="schedule" onChange={handleChange} value={values.schedule} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Country</label>
                            <input className={styles.input} type="text" name="country" onChange={handleChange} value={values.schedule} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Expiry Date</label>
                            <input className={styles.input} type="text" name="expiryDate" onChange={handleChange} value={values.expiryDate} />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Importer ID</label>
                            <input className={styles.input} type="text" name="importer.id" onChange={handleChange} value={values.importer.id} />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Importer Name</label>
                            <input className={styles.input} type="text" name="importer.name" onChange={handleChange} value={values.importer.name} />
                        </div>
                    </div>
                    <div className="py-4">
                        <button 
                            className="py-2 px-2 bg-blue-3 text-white rounded-md"
                            disabled={isSubmitting}
                            onMouseDown={() => {
                                submitForm();
                            }}
                        >{buttonText ? buttonText : "Add Drug"}</button>
                    </div>
                </div>
            )} 
        </Formik>
        </div>
    );
}

export default DrugForm;