import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  const phoneNumber = "923298892016"; // Pakistan format (+92 instead of 0)
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        asChild
        className="group relative overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-500 ease-out h-16 w-16 p-0 border-2 border-white/20 hover:border-white/40"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 ease-out" />
          <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
        </a>
      </Button>
    </div>
  );
};

export default WhatsAppButton;