import Navbar from '@/components/shared/Navbar';
import Hero from '@/components/features/Hero';
import Footer from '@/components/shared/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
