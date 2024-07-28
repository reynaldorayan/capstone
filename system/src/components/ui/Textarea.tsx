"use client";

import {
  Textarea as NextUiTextarea,
  TextAreaProps as NextUiTextAreaProps,
} from "@nextui-org/react";
import { forwardRef } from "react";

// Define the type for the props
interface TextareaProps extends NextUiTextAreaProps {
  error?: string;
}

// Define the Textarea component with forwardRef
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    return (
      <NextUiTextarea
        isClearable
        isInvalid={props.error != null}
        errorMessage={props.error}
        radius="sm"
        labelPlacement="outside"
        classNames={{
          label: "text-gray-800",
        }}
        {...props}
        ref={ref}
      />
    );
  }
);

// Set the display name for debugging purposes
Textarea.displayName = "Textarea";

export default Textarea;
