import { ReactNode } from "react";
import Button from "./Button";
import { ButtonProps } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";

export const CreateActionButton = ({
  children,
  icon,
  iconPlacement,
  tooltip,
  tooltipPlacement,
  isIconOnly,
  ...rest
}: {
  icon?: ReactNode;
  iconPlacement?: "start" | "end";
  tooltip?: string;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
  isIconOnly?: boolean;
} & ButtonProps) => {
  return (
    <Tooltip color="foreground" content={tooltip} placement={tooltipPlacement}>
      <Button
        className="h-9"
        startContent={iconPlacement == "start" ? icon : null}
        endContent={iconPlacement == "end" ? icon : null}
        isIconOnly={isIconOnly}
        {...rest}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

export const EditActionButton = ({
  children,
  icon,
  iconPlacement,
  tooltip,
  tooltipPlacement,
  ...rest
}: {
  icon?: ReactNode;
  iconPlacement?: "start" | "end";
  tooltip?: string;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
} & ButtonProps) => {
  return (
    <Tooltip color="foreground" content={tooltip} placement={tooltipPlacement}>
      <Button
        className="h-9"
        startContent={iconPlacement == "start" ? icon : null}
        endContent={iconPlacement == "end" ? icon : null}
        {...rest}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

export const DropActionButton = ({
  children,
  icon,
  iconPlacement,
  tooltip,
  tooltipPlacement,
  ...rest
}: {
  icon?: ReactNode;
  iconPlacement?: "start" | "end";
  tooltip?: string;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
} & ButtonProps) => {
  return (
    <Tooltip color="foreground" content={tooltip} placement={tooltipPlacement}>
      <Button
        className="h-9"
        startContent={iconPlacement == "start" ? icon : null}
        endContent={iconPlacement == "end" ? icon : null}
        {...rest}
      >
        {children}
      </Button>
    </Tooltip>
  );
};
