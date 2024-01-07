'use client'

//TypeScript error is currently expected until there is a proper update to react-dom
//@ts-expect-error
import { useFormStatus } from 'react-dom'

export function FormAddButton() {
    const addButtonStatus = useFormStatus()
    var enableDisableBtn = addButtonStatus.pending

    return (
        <button type="submit" disabled={addButtonStatus.pending} className="px-4 py-1 text-white rounded bg-green-500 disabled:border-gray-500 disabled:cursor-not-allowed">
            Add
        </button>
    )
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function FormSaveButton() {
    const saveButtonStatus = useFormStatus()

    return (
        <button type="submit" aria-disabled={saveButtonStatus.pending} className="px-4 py-1 text-white rounded bg-green-500 disabled:border-gray-500 disabled:cursor-not-allowed">
            Save
        </button>
    )
}