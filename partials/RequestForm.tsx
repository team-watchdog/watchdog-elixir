import axios from "axios";
import { FunctionComponent } from "react";
import { Formik, FormikErrors } from "formik";
import { parse } from 'csv-parse/browser/esm/sync';
import { Switch } from "@mantine/core";
import { TrashIcon } from "@heroicons/react/outline"
import isEmail from "validator/lib/isEmail";

// partials
import DrugSearch from "./DrugSearch";
import InstitutionSearch from "./InstitutionSearch";
import { Button } from "./Button";
import { RequiredMark } from "./RequiredMark";

// types
import { Request, DrugRequestItem, Equipment } from "../shared/types";

const styles = {
    field: "flex flex-col gap-y-2 mb-4",
    label: "flex-1 font-semibold",
    input: "flex-1 px-4 py-2 border rounded-md border-zinc-300",
}

interface RequestFormProps{
    onSubmit: (request: Request) => Promise<void>;
    request?: Request;
    buttonText?: string;
}

interface RequestFormikForm extends Request{
    newEquipmentName: string;
    newEquipmentNotes: string;
    batchProcessing: boolean;
    csvRecords: unknown[] | null;
}

const RequestForm: FunctionComponent<RequestFormProps> = (props) => {
    const { request, onSubmit, buttonText } = props;

    const initialValues = request ? request as RequestFormikForm : {
        drugItems: [] as DrugRequestItem[],
        equipments: [] as Equipment[],
        csvRecords: null,
        batchProcessing: false,
    } as RequestFormikForm;

    return (
        <div className="flex flex-1">
        <Formik
            initialValues={initialValues}
            validate={(values) => {
                const errors: FormikErrors<RequestFormikForm> = {};

                if (!values.name) errors.name = "Your name is required";
                if (!values.designation) errors.designation = "Designation is required";
                
                if (!values.email) errors.email = "Email is required";
                else if (!isEmail(values.email)) errors.email = "Please enter a valid email";

                if (!values.contactNumber) errors.contactNumber = "Contact number is required";

                return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                let parsedValues: Request = values;
                await onSubmit(parsedValues);
                setSubmitting(false);
            }}
        >
            {({ values, errors, setFieldValue, handleChange, isSubmitting, isValid, submitForm }) => (
                <div className="flex-1 py-2">
                    <div>
                        <div className={styles.field}>
                            <label className={styles.label}>Your name <RequiredMark /></label>
                            <input 
                                className={`${styles.input}${errors.name ? " border border-rating-red" : ""}`}
                                type="text" name="name" onChange={handleChange} value={values.name} 
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Institution</label>
                            <InstitutionSearch
                                selected={values.institution}
                                onSelect={(institution) => {
                                    setFieldValue("institution", institution);
                                }}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Request Title</label>
                            <input 
                                className={styles.input} 
                                type="text" 
                                name="title" 
                                value={values.title}
                                onChange={handleChange} 
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Current Designation <RequiredMark /></label>
                            <input 
                                className={`${styles.input}${errors.designation ? " border border-rating-red" : ""}`}
                                type="text" 
                                name="designation" 
                                value={values.designation}
                                onChange={handleChange} 
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Contact Number <RequiredMark /></label>
                            <input 
                                className={`${styles.input}${errors.contactNumber ? " border border-rating-red" : ""}`}
                                type="tel" 
                                name="contactNumber" 
                                value={values.contactNumber}
                                onChange={handleChange} 
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Email <RequiredMark /></label>
                            <input 
                                className={`${styles.input}${errors.email ? " border border-rating-red" : ""}`}
                                type="email" 
                                name="email" 
                                value={values.email}
                                onChange={handleChange} 
                            />
                        </div>
                        {/*
                        <div className={`${styles.field} mb-2`}>
                            <label className={styles.label}>Approved</label>
                            <Switch size="lg"/>
                        </div>
                        */}
                    </div>
                    <div className={`${styles.field} bg-zinc-100 py-4 px-4 rounded-md`}>
                        <label className={styles.label}>Upload Request CSV</label>
                        <p>Upload a .csv file with the fields "item" and "quantity" to bulk match items</p>
                        <input 
                            type="file" 
                            accept=".csv"
                            multiple={false}
                            onChange={(e) => {
                                const files = e.target.files;
                                setFieldValue("batchProcessing", true);
                                if (files && files.length > 0) {
                                    const fileReader =new FileReader();

                                    fileReader.onload = ((ev) => {
                                        const rawText = fileReader.result;
                                        const records = parse(rawText as string, {
                                            columns: true
                                        });
                                        
                                        setFieldValue("csvRecords", records);
                                        setFieldValue("batchProcessing", false);
                                    });

                                    fileReader.readAsText(files[0]);
                                }
                            }}
                        />
                        <div className="py-1">
                            <Button 
                                type="default"
                                label="Import File"
                                disabled={values.csvRecords ? false : true}
                                submitting={values.batchProcessing}
                                onMouseDown={async () => {
                                    setFieldValue("batchProcessing", true);

                                    try {
                                        const res = await axios.post("/api/bulkMatch", values.csvRecords);
                                        if (res.data && res.data.results) {
                                            setFieldValue("drugItems", [
                                                ...values.drugItems,
                                                ...res.data.results.drugItems,
                                            ]);

                                            setFieldValue("equipments", [
                                                ...values.equipments,
                                                ...res.data.results.equipments,
                                            ]);
                                        }
                                        console.log(res.data);
                                        setFieldValue("csvRecords", null);
                                    } catch (e) {
                                        console.log(e);
                                    }
                                    console.log("Request to the server");
                                    setFieldValue("batchProcessing", false);
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex-row py-4">
                        <div>
                            <h3 className="font-semibold text-lg py-2">Drugs</h3>
                            {values.drugItems.length > 0 ? (
                                <table className="table-auto w-full">
                                    <thead className="w-full">
                                        <tr>
                                            <th colSpan={2}>Generic Name</th>
                                            <th>Brand Name</th>
                                            <th>Importer</th>
                                            <th>Quantity</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {values.drugItems.map((item, i) => (
                                            <tr key={i} className="break-inside-avoid">
                                                <td className="align-top" colSpan={2}>
                                                    {item.originalText ? <h6>{item.originalText}</h6> : null}
                                                    <p>{item.drug.genericName}</p>
                                                </td>
                                                <td className="align-top">{item.drug.brandName ? item.drug.brandName : "—"}</td>
                                                <td className="align-top">{item.drug.importer.name ? item.drug.importer.name : "—"}</td>
                                                <td className="align-top">
                                                    <div className="flex">
                                                        <input 
                                                            type="number" 
                                                            className="bg-zinc-100 px-3 py-2 rounded-md flex-1"
                                                            name={`drugItems["${i}"].quantity`}
                                                            value={item.quantity}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="align-top">
                                                    <button 
                                                        className="p-2 bg-rating-red text-sm text-white rounded-md"
                                                        onMouseDown={() => {
                                                            const updatedList = [
                                                                ...values.drugItems.slice(0, i),
                                                                ...values.drugItems.slice(i + 1, values.drugItems.length),
                                                            ];
                                                            setFieldValue("drugItems", updatedList);
                                                        }}
                                                    ><TrashIcon width={18} height={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : null}
                        </div>
                        <div className="pt-4">
                            <DrugSearch
                                onSelect={(drug) => {
                                    const newRequestList = [...values.drugItems, {
                                        drug,
                                        quantity: undefined,
                                    }];

                                    setFieldValue("drugItems", newRequestList);
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex-row py-4">
                        <h3 className="font-semibold text-lg py-2">Medical Equipment and Other</h3>
                        {values.equipments.length > 0 ? (
                            <table className="table-auto w-full">
                                <thead className="w-full">
                                    <tr>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {values.equipments.map((item, i) => (
                                        <tr key={i}>
                                            <td className="align-top">
                                                <b>{item.itemName}</b>
                                                <p>{item.itemDescription}</p>
                                            </td>
                                            <td className="align-top">
                                                <input 
                                                    type="number" 
                                                    className="bg-zinc-100 px-3 py-2 rounded-md flex-1"
                                                    name={`equipments["${i}"].quantity`}
                                                    value={item.quantity}
                                                    onChange={handleChange}
                                                />
                                            </td>
                                            <td className="align-top">
                                                <button 
                                                    className="p-2 bg-rating-red text-sm text-white rounded-md"
                                                    onMouseDown={() => {
                                                        const updatedList = [
                                                            ...values.equipments.slice(0, i),
                                                            ...values.equipments.slice(i + 1, values.equipments.length),
                                                        ];
                                                        setFieldValue("equipments", updatedList);
                                                    }}
                                                ><TrashIcon width={18} height={18} /></button>
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
                                    placeholder="Enter other essential items such as saline, etc." 
                                    value={values.newEquipmentName}
                                    onChange={handleChange}
                                    name="newEquipmentName"
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Item Description and Notes</label>
                                <textarea 
                                    className={styles.input} 
                                    rows={5} 
                                    placeholder="Add additional notes. For an example: different variations and sizes, etc." 
                                    value={values.newEquipmentNotes}
                                    onChange={handleChange}
                                    name="newEquipmentNotes"
                                />
                            </div>
                            <button 
                                className="py-2 px-2 text-white rounded-md bg-zinc-700"
                                onMouseDown={() => {
                                    const newItem = {
                                        itemName: values.newEquipmentName,
                                        itemDescription: values.newEquipmentNotes,
                                    } as Equipment;

                                    const newArr = [...values.equipments, newItem];
                                    setFieldValue("equipments", newArr);
                                    setFieldValue("newEquipmentName", "");
                                    setFieldValue("newEquipmentNotes", "");
                                }}
                                disabled={!values.newEquipmentName}
                            >
                                Add Item
                            </button>
                        </div>
                    </div>

                    <div className="flex-row py-4">
                        <div className={styles.field}>
                            <label className={styles.label}>Additional Notes</label>
                            <textarea 
                                className={styles.input} 
                                rows={4} 
                                value={values.additionalNotes} 
                                name="additionalNotes"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="py-4">
                        <Button 
                            type="primary"
                            submitting={isSubmitting}
                            onMouseDown={submitForm}
                            disabled={!isValid}
                            label={buttonText ? buttonText : "Send Request"}
                        />
                    </div>
                </div>
            )}
        </Formik>
        </div>
    );
}

export default RequestForm;