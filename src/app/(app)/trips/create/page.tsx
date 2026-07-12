import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import CreateTripForm from '@/components/features/CreateTripForm';

/**
 * CreateTripPage — Server Component shell.
 *
 * Renders the static Header, Footer, and page boundaries on the server,
 * while lazy/client rendering the interactive CreateTripForm inside it.
 */
export default function CreateTripPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-10 pt-24 w-full">
        <CreateTripForm />
      </main>
      <Footer />
    </div>
  );
}
