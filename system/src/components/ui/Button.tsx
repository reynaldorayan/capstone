'use client'

import {
    Button as NextUiButton,
    ButtonProps as NextUiButtonProps,
} from '@nextui-org/react'
import { forwardRef } from 'react'

// Define the type for the props
interface ButtonProps extends NextUiButtonProps { }

// Define the Button component with forwardRef
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    return <NextUiButton radius="sm" color='primary' {...props} ref={ref} />
})

// Set the display name for debugging purposes
Button.displayName = 'Button'

export default Button
