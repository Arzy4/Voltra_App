import Link from "next/link";
import Footer from "../../components/footer";

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen pb-24">
      <section className="sticky top-0 z-50 rounded-b-[20px] bg-primary-green px-6 py-6">
        <div className="mb-3 h-[10svh] text-white">
          <h1 className="text-2xl font-bold">
            Voltra
          </h1>

          <p className="text-xl">
            Smart EV Charging Booking
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <Link
              href="/bookingsPage/activePage"
              className="border-r border-green-300 text-center"
            >
              Ongoing
            </Link>

            <Link href="/bookingsPage/historyPage">
              History
            </Link>
          </div>
        </div>
      </section>

      {children}

      <Footer />
    </main>
  );
}