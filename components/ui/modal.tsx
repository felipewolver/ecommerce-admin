"use client";

import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";


interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}


// Component Modal personalizado 
export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children
}) => {
    const onChange = (open: boolean) => {
      if (!open) { 
        onClose();
      }
  };

  return ( 
    <Dialog open={isOpen} onOpenChange={onChange} >
      <DialogContent>
        <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                    {description}
                </DialogDescription>
        </DialogHeader>
        
        <div>
          {children}
        </div>
      </DialogContent>
    
    </Dialog>
  );
};