import { FunctionComponent } from "react";
import { NextPageContext } from "next";
import { Formik, FormikErrors } from "formik";
import { TrashIcon } from "@heroicons/react/outline";
import isEmail from "validator/lib/isEmail";

// partials
import SectionHeader from "../partials/SectionHeader";
import { Button } from "../partials/Button";
import DrugSearch from "../partials/DrugSearch";

// utils
import { RequestWithCookie, getAuthUser, SignedPayload } from "../middleware/utils";

// styles
import { formClassNames } from "../shared/styles";

// types
import { Pledge, DrugRequestItem, Equipment } from "../shared/types";

// stores
import { pledgeStore } from "../shared/stores/pledge";
import { useRouter } from "next/router";
import axios from "axios";


interface PledgeForm extends Pledge{
    newEquipmentName: string;
    newEquipmentNotes: string;
}

const RequiredMark: FunctionComponent = () => {
    return <span className="text-rating-red">*</span>
}

const MyPledge: FunctionComponent = () => {
	const resetPledge = pledgeStore((state) => state.resetPledge);
	const setPledge = pledgeStore((state) => state.setPledge);
	const pledge = pledgeStore((state) => state.pledge);

    const router = useRouter();

    const initialValues = {
        ...pledge,
        newEquipmentName: "",
        newEquipmentNotes: "",
    } as PledgeForm;

    return (
        <div>
            <main>
                <div className="container">
                    <SectionHeader 
                        Left={<>My Pledge</>}
                        Right={(
                            <Button 
                                type="default"
                                label="Clear Pledge"
                                onMouseDown={() => {
                                    resetPledge();
                                    router.reload();
                                }}
                            />
                        )}
                    />
                    <div className="py-2 px-4 bg-slate-200 mt-4 mb-2 rounded-md">
                        <p className="py-1">When you make a pledge, your request will be routed to the coordinator at the Ministry of Health, the original requesters, and other aid organizations inside our network via email. You will be copied to this email and you can reply directly to get in touch with these parties.</p>
                        <p className="py-1">Your pledge will also appear in the "Pledges" section of this website with your contact details anonymized. However, your contact details will be available to organizations inside our network with administrator access.</p>
                    </div>
                    <div className="flex flex-row">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    setSubmitting(true);
                                    await axios.post("/api/createPledge", values);
                                    resetPledge();
                                    router.push("/pledgeSuccess");
                                } catch (e) {
                                    console.log(e);
                                }
                                resetPledge();
                            }}
                            validate={(values) => {
                                const errors: FormikErrors<PledgeForm> = {};
                                
                                if (!values.name) errors.name = "Name required";
                                
                                if (!values.email) errors.email = "Email is required";
                                else if (!isEmail(values.email)) errors.email = "Please enter a valid email";
                                
                                if (!values.phoneNumber) errors.phoneNumber = "Phone number required";

                                return errors;
                            }}
                        >
                            {({ values, errors, setFieldValue, handleChange, isSubmitting, submitForm }) => (
                                <div className="flex-1 py-6">
                                    <div className={formClassNames.field}>
                                        <label className={formClassNames.label}>Name <RequiredMark /></label>
                                        <input className={`${formClassNames.input}${errors.name ? " border border-rating-red" : ""}`} type="text" name="name" onChange={handleChange} value={values.name} />
                                    </div>
                                    <div className={formClassNames.field}>
                                        <label className={formClassNames.label}>Email <RequiredMark /></label>
                                        <input className={`${formClassNames.input}${errors.email ? " border border-rating-red" : ""}`}  type="email" name="email" onChange={handleChange} value={values.email} />
                                    </div>
                                    <div className={formClassNames.field}>
                                        <label className={formClassNames.label}>Phone <RequiredMark /></label>
                                        <input className={`${formClassNames.input}${errors.phoneNumber ? " border border-rating-red" : ""}`}  type="phone" name="phoneNumber" onChange={handleChange} value={values.phoneNumber} />
                                    </div>
                                    <div className={formClassNames.field}>
                                        <label className={formClassNames.label}>Notes</label>
                                        <textarea className={formClassNames.input} name="notes" onChange={handleChange} value={values.notes} rows={6}></textarea>
                                    </div>
                                    {/*
                                    <div className={formClassNames.field}>
                                        <label className={formClassNames.label}>Supporting Files</label>
                                        <input type="file" />
                                    </div>
                                    */}
                                    <div className="py-6">
                                        <h3 className="text-xl font-bold">Supplies</h3>
                                        <div className="flex-row py-4">
                                            <div>
                                                <h3 className="font-semibold text-lg py-2">Drugs</h3>
                                                {values.drugItems && values.drugItems.length > 0 ? (
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
                                                                                
                                                                                setPledge({
                                                                                    ...values,
                                                                                    drugItems: updatedList,
                                                                                } as Pledge);
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
                                                        setPledge({
                                                            ...values,
                                                            drugItems: newRequestList,
                                                        } as Pledge);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-row py-4">
                                            <h3 className="font-semibold text-lg py-2">Medical Equipment and Other</h3>
                                            {values.equipments && values.equipments.length > 0 ? (
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

                                                                            setPledge({
                                                                                ...values,
                                                                                equipments: updatedList,
                                                                            });
                                                                        }}
                                                                    ><TrashIcon width={18} height={18} /></button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : null}
                                            <div className="py-4 px-4 bg-zinc-100 rounded-md mt-4">
                                                <div className={formClassNames.field}>
                                                    <label className={formClassNames.label}>Item name</label>
                                                    <input 
                                                        className={formClassNames.input} 
                                                        type="text" 
                                                        placeholder="Enter other essential items such as saline, etc." 
                                                        value={values.newEquipmentName}
                                                        onChange={handleChange}
                                                        name="newEquipmentName"
                                                    />
                                                </div>
                                                <div className={formClassNames.field}>
                                                    <label className={formClassNames.label}>Item Description and Notes</label>
                                                    <textarea 
                                                        className={formClassNames.input} 
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

                                                        const newArr = [...(values.equipments ? values.equipments : []), newItem];
                                                        setFieldValue("equipments", newArr);
                                                        setFieldValue("newEquipmentName", "");
                                                        setFieldValue("newEquipmentNotes", "");

                                                        setPledge({
                                                            ...values,
                                                            equipments: newArr,
                                                        });
                                                    }}
                                                    disabled={!values.newEquipmentName}
                                                >
                                                    Add Item
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="flex justify-start gap-x-2">
                                        <Button 
                                            type="default"
                                            label="Save Changes"
                                            onMouseDown={() => {
                                                let newPledge = values as Pledge;
                                                setPledge(newPledge);
                                            }}
                                        />
                                        <Button 
                                            type="primary"
                                            label="Submit Pledge"
                                            submitting={isSubmitting}
                                            disabled={errors.email || errors.name || errors.phoneNumber ? true : false}
                                            onMouseDown={submitForm}
                                        />
                                    </div>
                                </div>
                            )}
                        </Formik>
                    </div>
                </div>
            </main>
        </div>
    );
}


export const getServerSideProps = async ({ req, query }: NextPageContext) => {
    const account = getAuthUser(req as RequestWithCookie) as SignedPayload;

    return {
        props: {
          account,
        }
    }
}

export default MyPledge;