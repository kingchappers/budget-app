'use client'

//@ts-expect-error TypeScript error is currently expected until there is a proper update to react-dom - Seventh Jan 2024
import { useFormStatus } from 'react-dom'

export function FormAddButton() {
    const addButtonStatus = useFormStatus()

    return (
        <button type="submit" aria-disabled={addButtonStatus.pending} className="px-4 py-1 text-white rounded bg-green-500">
            {addButtonStatus.pending ? "Adding..." : "Add"}
        </button>
    )
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function FormSaveButton() {
    const saveButtonStatus = useFormStatus()

    return (
        <button type="submit" aria-disabled={saveButtonStatus.pending} className="px-4 py-1 text-white rounded bg-green-500">
            {saveButtonStatus ? "Saving..." : "Save"}
        </button>
    )
}