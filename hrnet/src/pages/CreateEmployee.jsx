import React, { useCallback, useMemo, useState } from "react";
import { states } from '../config/states'
import { departments } from '../config/departements'
import DatePicker from "../components/DatePicker"
import CustomSelect from "../components/CustomSelect";
import Modal from "../components/Modal";
import { useEmployeesDispatch } from "../EmployeeContext";
import { Link } from "react-router-dom";

export default function CreateEmployee() {
    const [modalVisible, setModalVisible] = useState(false)
    const [ employeeFormValues, setEmployeeFormValues] = useState({})

    const onInputChange = (e) => {
        const formValues = { ...employeeFormValues}
        formValues[e.target.id] = e.target.value
        setEmployeeFormValues(formValues)
    }
    const dispatch = useEmployeesDispatch()
    const onFormSubmit = (e) => {
        e.preventDefault()
        dispatch({
            type: 'add',
            employee: employeeFormValues
        })
        setModalVisible(true)
    }
    const handleModalClose = () => {
        setModalVisible(false)
    }

    return (
        <>
            <Link to={'/employees'}>View Current Employees</Link>
            <h2>Create Employee</h2>
            <form className="hr-app__create-form" onSubmit={onFormSubmit}>
                <label htmlFor="firstName">First Name</label>
                <input type='text' id="firstName" onChange={onInputChange} value={employeeFormValues.firstName ? employeeFormValues.firstName : ''} />
                <label htmlFor="lastName">Last Name</label>
                <input type='text' id='lastName' onChange={onInputChange} value={employeeFormValues.lastName ? employeeFormValues.lastName : ''}/>
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <DatePicker id='dateOfBirth' onChange={onInputChange} value={employeeFormValues.dateOfBirth ? employeeFormValues.dateOfBirth : ''}/>
                <label htmlFor="startDate">Start Date</label>
                <DatePicker id='startDate' onChange={onInputChange} value={employeeFormValues.startDate ? employeeFormValues.startDate : ''}/>
                <fieldset className="address">
                    <legend>Address</legend>

                    <label htmlFor="street">Street</label>
                    <input id="street" type="text" onChange={onInputChange} value={employeeFormValues.street ? employeeFormValues.street : ''}/>

                    <label htmlFor="city">City</label>
                    <input id="city" type="text" onChange={onInputChange} value={employeeFormValues.city ? employeeFormValues.city : ''}/>

                    <label htmlFor="state">State</label>
                    <CustomSelect id='state' options={states} onChange={onInputChange} defaultValue={employeeFormValues.state ? employeeFormValues.state : undefined} placeHolder='Please select a state...'/>
                    <label htmlFor="zipCode">Zip Code</label>
                    <input id="zipCode" type="number" onChange={onInputChange} value={employeeFormValues.zipCode ? employeeFormValues.zipCode : ''}/>
                </fieldset>
                <CustomSelect id='department' options={departments} onChange={onInputChange} defaultValue={employeeFormValues.department ? employeeFormValues.department : undefined} placeHolder='Please select a department...'/>
                <button type='submit'>Save</button>
            </form>
            <Modal visible={modalVisible} onClose={handleModalClose}>
                <span>Employee successfully created !</span>
            </Modal>
        </>
    )
}