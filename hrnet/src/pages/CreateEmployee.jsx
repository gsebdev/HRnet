import React, { useState } from "react";
import { states } from '../config/states'
import { departments } from '../config/departements'
import DatePicker from "../components/DatePicker"
import CustomSelect from "../components/CustomSelect";
import Modal from "../components/Modal";
import { useEmployeesDispatch } from "../EmployeeContext";
import { Link } from "react-router-dom";
import ControledForm from "../components/ControledForm";

export default function CreateEmployee() {
    const [modalVisible, setModalVisible] = useState(false)

    const dispatch = useEmployeesDispatch()
    const onFormSubmit = (employeeFormValues) => {
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
            <ControledForm
                fields={
                    {
                        firstName: {
                            label: 'First Name',
                            type: 'text',
                            assertFn: value => {
                                if (!value) { return 'This field is required' }
                                if (!value.match(/^[a-z-A-Z]+$/)) { return 'Only letters allowed' }
                                return true
                            }
                        },
                        lastName: {
                            label: 'Last Name',
                            type: 'text',
                            assertFn: value => {
                                if (!value) { return 'This field is required' }
                                if (!value.match(/^[a-z-A-Z]+$/)) { return 'Only letters allowed' }
                                return true
                            }
                        },
                        dateOfBirth: {
                            label: 'Date of Birth',
                            type: DatePicker,
                            assertFn: (value) => {
                                if (!value) { return 'This field is required' }
                                if (!value.match(/^(0[1-9]|1[0-2])\/(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(19|20)([0-9]{2})$/)) {
                                    return 'Date format invalid'
                                }
                                return true
                            }
                        },
                        startDate: {
                            label: 'Start Date',
                            type: DatePicker,
                            assertFn: (value) => {
                                if (!value) { return 'This field is required' }
                                if (!value.match(/^(0[1-9]|1[0-2])\/(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(19|20)([0-9]{2})$/)) {
                                    return 'Date format invalid'
                                }
                                return true
                            }
                        },
                        address: {
                            type: 'fieldset',
                            legend: 'Address',
                            inputs: {
                                street: {
                                    label: 'Street',
                                    type: 'text',
                                    assertFn: (value) => !value ? 'This field is required' : true
                                },
                                city: {
                                    label: 'City',
                                    type: 'text',
                                    assertFn: (value) => !value ? 'This field is required' : true
                                },
                                state: {
                                    label: 'State',
                                    type: CustomSelect,
                                    options: states,
                                    placeholder: 'Please select a state...',
                                    assertFn: (value) => !value ? 'This field is required' : true
                                },
                                zipCode: {
                                    label: 'Zip Code',
                                    type: 'number',
                                    assertFn: (value) => !value ? 'This field is required' : true
                                },

                            }
                        },
                        department: {
                            label: 'Department',
                            type: CustomSelect,
                            options: departments,
                            placeholder: 'Please select a department...',
                            assertFn: (value) => !value ? 'This field is required' : true
                        }
                    }
                }
                submitText='Save'
                onSubmit={onFormSubmit}
                className="hr-app__create-form"
            />
            <Modal visible={modalVisible} onClose={handleModalClose}>
                <span>Employee successfully created !</span>
            </Modal>
        </>
    )
}