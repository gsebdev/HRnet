import React from "react";
import { states } from '../config/states'
import { departments } from '../config/departements'
import DatePicker from "../components/DatePicker"

export default function CreateEmployee() {
    return (
        <React.Fragment>
            <form className="hr-app__create-form">
                <label htmlFor="">First Name</label>
                <input type='text' />
                <label htmlFor="">Last Name</label>
                <input type='text' />
                <label htmlFor="">Date of Birth</label>
                <DatePicker />
                <label htmlFor="">Start Date</label>
                <DatePicker />
                <fieldset class="address">
                    <legend>Address</legend>

                    <label for="street">Street</label>
                    <input id="street" type="text" />

                    <label for="city">City</label>
                    <input id="city" type="text" />

                    <label for="state-button">State</label>
                    <select name="state" id="state">
                        {states.map((state, index) => {
                            return <option key={state.name + index} value={state.abbreviation}>{state.name}</option>
                        })}
                    </select>
                    <label for="zip-code">Zip Code</label>
                    <input id="zip-code" type="number" />
                </fieldset>
                <select name='department' id='department'>
                    {departments.map((department, index) => {
                        return <option key={department + index}>{department}</option>
                    })}
                </select>
                <button type='submit'>Save</button>
            </form>
        </React.Fragment>
    )
}