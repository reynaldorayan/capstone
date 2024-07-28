"use client";

import {
  Modal as NextUiModal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalProps as NextUiModalProps,
} from "@nextui-org/react";
import { ReactNode } from "react";

interface ModalProps extends NextUiModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?:
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xs"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "full";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  return (
    <NextUiModal
      isDismissable={false}
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      placement="center"
      size={size}
    >
      <ModalContent className="pb-5">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-base font-medium">
              {title}
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
          </>
        )}
      </ModalContent>
    </NextUiModal>
  );
};

export default Modal;
