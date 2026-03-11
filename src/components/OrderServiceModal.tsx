import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import OrderServiceForm from "./OrderServiceForm";

interface OrderServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: string;
}

const OrderServiceModal: React.FC<OrderServiceModalProps> = ({
  isOpen,
  onClose,
  selectedService
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 futuristic-modal">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold font-space gradient-text">
              🚀 Order Service
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-muted-foreground mt-2">
            Fill out this form to get started with your project. We'll contact you via WhatsApp.
          </p>
        </DialogHeader>
        
        <div className="p-6 pt-2">
          <OrderServiceForm 
            selectedService={selectedService}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderServiceModal;