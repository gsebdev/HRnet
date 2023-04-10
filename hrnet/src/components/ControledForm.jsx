import { useState } from "react"
import '../controled-form.scss'
export default function ControledForm({ fields, onSubmit, submitText, className }) {
    const [fieldsState, setFieldsState] = useState(fields)
    const [liveControl, setLiveControl] = useState(false)
    
    const isValid = (field) => {
        return field.assertFn ? field.assertFn(field.value) : true
    }
    const onInputChange = (e, id, fieldset = null) => {
        const newFields = { ...fieldsState }
        if (!fieldset) {
            newFields[id].value = e.target.value
            if(liveControl) {
                const valid = isValid(newFields[id])
                    newFields[id].error = valid === true ? undefined : valid
            }
        } else {
            newFields[fieldset].inputs[id].value = e.target.value
            if(liveControl) {
                const valid = isValid(newFields[fieldset].inputs[id])
                newFields[fieldset].inputs[id].error = valid === true ? undefined : valid
            }
        }
        setFieldsState(newFields)
    }
    const onFormSubmit = (e) => {
        e.preventDefault()
        let errors = 0
        Object.keys(fieldsState).forEach((fieldId) => {
            const field = fieldsState[fieldId]
            if (field.type === 'fieldset') {
                const inputs = field.inputs
                Object.keys(inputs).forEach(inputId => {
                    const fieldsetField = inputs[inputId]
                    const valid = isValid(fieldsetField)
                    if (valid !== true) {
                        errors++
                        fieldsetField.error = valid
                    }
                })
            } else {
                const valid = isValid(field)
                if (valid !== true) {
                    errors++
                    field.error = valid
                }
            }
        })
        if (errors > 0) {
            setFieldsState({ ...fieldsState })
            setLiveControl(true)
        } else {
            const values = {}
            Object.keys(fieldsState).forEach(id => {
                if (fieldsState[id].type === 'fieldset') {
                    values[id] = {}
                    const inputs = fieldsState[id].inputs
                    Object.keys(inputs).forEach(inputId => {
                        values[id][inputId] = inputs[inputId].value
                    })
                } else {
                    values[id] = fieldsState[id].value
                }
            })
            onSubmit(values)
            setFieldsState({...fields})
        }
    }
    const getInput = (field, id, fieldset = null) => {
        let input
        if (field.type === 'select') {
            input = <select onChange={(e) => { onInputChange(e, id, fieldset) }}>{field.options.map((option, index) => <option key={option + index} value={option.value}>{option.name}</option>)}</select>
        } else if (typeof field.type === 'function') {
            input = <field.type placeholder={field.placeholder} options={field.options} id={id} value={field.value || ''} className={field.error ? 'has-error' : ''} onChange={(e) => { onInputChange(e, id, fieldset) }} />
        } else {
            input = <input type={field.type} placeholder={field.placeholder} id={id} value={field.value || ''} className={field.error ? 'has-error' : ''} onChange={(e) => { onInputChange(e, id, fieldset) }} />
        }
        return (
            <div key={field + id} className={field.error ? 'SG-form__input-group has-error' : 'SG-form__input-group'} data-error={field.error}>
                <label htmlFor={id}>{field.label}</label>
                {input}
            </div>
        )
    }
    return (
        <form className={className} onSubmit={onFormSubmit}>
            {
                Object.keys(fieldsState).map((fieldId, index) => {
                    if (fieldsState[fieldId].type === 'fieldset') {
                        const fieldset = fieldsState[fieldId]
                        return (
                            <fieldset key={fieldId + index}>
                                <legend>{fieldset.legend}</legend>
                                {Object.keys(fieldset.inputs).map(fId => getInput(fieldset.inputs[fId], fId, fieldId))}
                            </fieldset>
                        )
                    }
                    return getInput(fieldsState[fieldId], fieldId)
                })
            }
            <button type='submit'>{submitText}</button>
        </form>
    )

}