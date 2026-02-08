"use client";

import { useModal } from "../context/ModalContext";
import { LoginModal } from "./login-modal";
import { MessageModal } from "./MessageModal";
import { ClientOnly } from "./ClientOnly";

const ModalLookup = {
  LoginModal,
  MessageModal,
};

export const ModalManager = () => {
  const { modal, modalProps, closeModal } = useModal();

  if (!modal) return null;

  const ModalComponent = ModalLookup[modal as keyof typeof ModalLookup];

  if (!ModalComponent) return null;

  return (
    <ClientOnly>
      <ModalComponent onClose={closeModal} {...modalProps} message=""/>
    </ClientOnly>
  );
};
