import React, { useState } from "react";
import { states } from '../config/states'
import { departments } from '../config/departements'
import DatePicker from "../components/DatePicker"
import CustomSelect from "../components/CustomSelect";
import Modal from "../components/Modal";
import { useEmployeesDispatch } from "../EmployeeContext";

export default function CreateEmployee() {
    const [modalVisible, setModalVisible] = useState(false)
    const [ firstName, setFirstName] = useState(null)
    const dispatch = useEmployeesDispatch()
    const onFormSubmit = (e) => {
        e.preventDefault()
        dispatch({
            type: 'add',
            employee: {firstName}
        })
        setModalVisible(true)
    }
    const handleModalClose = () => {
        setModalVisible(false)
    }

    return (
        <>
            <form className="hr-app__create-form" onSubmit={onFormSubmit}>
                <label htmlFor="">First Name</label>
                <input type='text' onChange={(e) => {setFirstName(e.target.value)}} />
                <label htmlFor="">Last Name</label>
                <input type='text' />
                <label htmlFor="">Date of Birth</label>
                <DatePicker />
                <label htmlFor="">Start Date</label>
                <DatePicker />
                <fieldset className="address">
                    <legend>Address</legend>

                    <label htmlFor="street">Street</label>
                    <input id="street" type="text" />

                    <label htmlFor="city">City</label>
                    <input id="city" type="text" />

                    <label htmlFor="state-button">State</label>
                    <CustomSelect options={states} onChange={() => { return }} />
                    <label htmlFor="zip-code">Zip Code</label>
                    <input id="zip-code" type="number" />
                </fieldset>
                <CustomSelect options={departments} onChange={() => { return }} />
                <button type='submit'>Save</button>
            </form>
            <Modal visible={modalVisible} onClose={handleModalClose}>
                <span>Employee successfully created !</span>
            </Modal>
        </>
    )
}