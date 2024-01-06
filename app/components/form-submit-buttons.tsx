'use client'

//TypeScript error is currently expected until there is a proper update to react-dom
import { useFormStatus } from 'react-dom'

export function FormAddButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" aria-disabled={pending} className="px-4 py-1 text-white rounded bg-green-500">
      {pending ? "Adding..." : "Add"}
    </button>
  )
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function FormSaveButton() {
    const { pending } = useFormStatus()

    return (
      <button type="submit" aria-disabled={pending} className="px-4 py-1 text-white rounded bg-green-500">
        {pending ? "Saving..." : "Save"}
      </button>
    )
  }