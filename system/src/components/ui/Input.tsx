"use client";

import {
  Input as NextUiInput,
  InputProps as NextUiInputProps,
} from "@nextui-org/react";
import { forwardRef } from "react";

// Define the type for the props
interface InputProps extends NextUiInputProps {
  error?: string;
}

// Define the Input component with forwardRef
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <NextUiInput
      radius="sm"
      labelPlacement="outside"
      placeholder=" "
      isInvalid={props.error != null}
      errorMessage={props.error}
      {...props}
      ref={ref}
    />
  );
});

// Set the display name for debugging purposes
Input.displayName = "Input";

export default Input;
