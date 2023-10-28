"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";

/* Modal q vai prover em toda a aplicação assim como outros providers */
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
    </>
  );
}