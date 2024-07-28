"use client";

import {
  Chip as NextUiChip,
  ChipProps as NextUiChipProps,
} from "@nextui-org/react";
import { forwardRef } from "react";

// Define the type for the props
interface ChipProps extends NextUiChipProps {}

// Define the Chip component with forwardRef
const Chip = forwardRef<HTMLDivElement, ChipProps>((props, ref) => {
  return <NextUiChip radius="sm" color="primary" {...props} ref={ref} />;
});

// Set the display name for debugging purposes
Chip.displayName = "Chip";

export default Chip;
