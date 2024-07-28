'use client'

import { InputProps as NextUiInputProps } from '@nextui-org/react'
import { useState, forwardRef } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import Input from './Input'

// Define the type for the props
interface InputProps extends NextUiInputProps {
    error?: string
}

// Define the Input component with forwardRef
const PasswordInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const [isVisible, setIsVisible] = useState(false)

    const toggleVisibility = () => setIsVisible(!isVisible)

    return (
        <Input
            error={props.error}
            endContent={
                <button
                    type="button"
                    className="focus:outline-none"
                    onClick={toggleVisibility}
                >
                    {isVisible ? (
                        <AiOutlineEyeInvisible className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                        <AiOutlineEye className="text-2xl text-default-400 pointer-events-none" />
                    )}
                </button>
            }
            type={isVisible ? 'text' : 'password'}
            ref={ref}
            {...props}
        />
    )
})

// Set the display name for debugging purposes
PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
