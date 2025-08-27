const AboutUs = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-8">
            About Us
          </h2>
          <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
            <p className="text-lg md:text-xl">
              At Zarvean, we believe in creating designs that are minimal, timeless, and impactful. 
              What began as a small vision has quickly grown into a brand known for innovation and creativity. 
              Our mission is simple — to craft solutions that are modern, reliable, and built for the future. 
              With sustainability and quality at the heart of everything we do, Zarvean is more than just 
              a company — it's a commitment to progress and lasting value.
            </p>
          </div>
          <div className="mt-8 w-24 h-0.5 bg-primary mx-auto"></div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;