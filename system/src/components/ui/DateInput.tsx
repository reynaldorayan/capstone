'use client'

import {
    DateInput as NextUiDateInput,
    DateInputProps as NextUiDateInputProps,
} from '@nextui-org/react'
import { forwardRef } from 'react'

// Define the type for the props
interface DateInputProps extends NextUiDateInputProps {
    error?: string
}

// Define the Textarea component with forwardRef
const DateInput = forwardRef<HTMLElement, DateInputProps>((props, ref) => {
    return (
        <NextUiDateInput
            radius="sm"
            labelPlacement="outside"
            {...props}
            ref={ref}
            isInvalid={props.error != null}
            errorMessage={props.error}
        />
    )
})

// Set the display name for debugging purposes
DateInput.displayName = 'DateInput'

export default DateInput
