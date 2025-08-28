const AboutUs = () => {
  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto">
        <div className="mx-auto text-center fade-in" style={{ maxWidth: '64rem' }}>
          <h2 className="font-serif fw-bold text-primary mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            About Us
          </h2>
          <div className="text-muted" style={{ maxWidth: 'none', lineHeight: '1.75' }}>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
              At Zarvean, we believe in creating designs that are minimal, timeless, and impactful. 
              What began as a small vision has quickly grown into a brand known for innovation and creativity. 
              Our mission is simple — to craft solutions that are modern, reliable, and built for the future. 
              With sustainability and quality at the heart of everything we do, Zarvean is more than just 
              a company — it's a commitment to progress and lasting value.
            </p>
          </div>
          <div className="mt-4 mx-auto bg-primary" style={{ width: '6rem', height: '2px' }}></div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;