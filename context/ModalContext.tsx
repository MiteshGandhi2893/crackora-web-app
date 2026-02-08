/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ModalProps = Record<string, any>;
type ModalResolver = (result: any) => void;

type ModalContextType = {
  modal: string | null;
  modalProps: ModalProps;
  openModal: (modalName: string, props?: ModalProps) => Promise<any>;
  closeModal: (result?: any) => void;
};

const ModalContext = createContext<ModalContextType | null>(null);
let resolver: ModalResolver | null = null;

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<string | null>(null);
  const [modalProps, setModalProps] = useState<ModalProps>({});

  const openModal = (modalName: string, props: ModalProps = {}) => {
    setModal(modalName);
    setModalProps(props);

    return new Promise((resolve) => {
      resolver = resolve;
    });
  };

  const closeModal = (result?: any) => {
    setModal(null);
    setModalProps({});
    resolver?.(result);
    resolver = null;
  };

  return (
    <ModalContext.Provider value={{ modal, modalProps, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
}
