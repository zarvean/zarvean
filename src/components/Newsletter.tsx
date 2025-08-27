import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => {
  return (
    <section className="bg-secondary section-padding">
      <div className="container mx-auto text-center">
        <div className="max-w-2xl mx-auto fade-in">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 tracking-tight">
            Stay In Touch
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Be the first to know about new collections, exclusive offers, and style inspiration.
          </p>
          
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 border-border focus:border-primary"
            />
            <Button className="btn-hero whitespace-nowrap">
              Subscribe
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;