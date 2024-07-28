"use client";

import {
  TimeInput as NextUiTimeInput,
  TimeInputProps as NextUiTimeInputProps,
} from "@nextui-org/react";
import { forwardRef } from "react";

// Define the type for the props
interface TimeInputProps extends NextUiTimeInputProps {
  error?: string;
}

// Define the Textarea component with forwardRef
const TimeInput = forwardRef<HTMLElement, TimeInputProps>((props, ref) => {
  return (
    <NextUiTimeInput
      radius="sm"
      labelPlacement="outside"
      isInvalid={props.error != null}
      errorMessage={props.error}
      {...props}
      ref={ref}
    />
  );
});

// Set the display name for debugging purposes
TimeInput.displayName = "TimeInput";

export default TimeInput;
