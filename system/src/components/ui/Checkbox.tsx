'use client'

import {
    Checkbox as NextUiCheckbox,
    CheckboxProps as NextUiCheckboxProps,
} from '@nextui-org/react'
import { forwardRef } from 'react'

// Define the type for the props
interface CheckboxProps extends NextUiCheckboxProps {
    error?: string
}

// Define the Checkbox component with forwardRef
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
    return (
        <NextUiCheckbox
            radius="sm"
            {...props}
            ref={ref}
            isInvalid={props.error != null}
            classNames={{ label: 'text-sm' }}
        />
    )
})

// Set the display name for debugging purposes
Checkbox.displayName = 'Checkbox'

export default Checkbox
