import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutUs from "@/components/AboutUs";
import BrandShowcase from "@/components/BrandShowcase";
import HeritageQuote from "@/components/HeritageQuote";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen page-transition">
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <AboutUs />
        <BrandShowcase />
        <HeritageQuote />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
