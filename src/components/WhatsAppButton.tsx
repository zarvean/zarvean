import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  const phoneNumber = "923298892016";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        asChild
        className="group relative overflow-hidden bg-black text-white hover:bg-white hover:text-black h-16 w-16 p-0 rounded-full transition-all duration-300 ease-out shadow-lg"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-all duration-300 ease-out" />
        </a>
      </Button>
    </div>
  );
};

export default WhatsAppButton;