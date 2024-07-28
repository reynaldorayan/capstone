"use client";

import {
  Select as NextUiSelect,
  SelectProps as NextUiSelectProps,
} from "@nextui-org/react";
import { forwardRef } from "react";

// Define the type for the props
interface SelectProps extends NextUiSelectProps {
  error?: string;
}

// Define the Select component with forwardRef
const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  return (
    <NextUiSelect
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
Select.displayName = "Select";

export default Select;
