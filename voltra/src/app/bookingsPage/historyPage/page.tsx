import Link from "next/link";
import Footer from "../../components/footer";

export default function HistoryPage() {
  return (
    <main className="min-h-screen pb-24">
      <section className="sticky top-0 z-50 rounded-b-[20px] bg-primary-green px-6 py-6">
        <div className="mb-3 h-[10svh] text-white">
          <h1 className="text-2xl font-bold">Voltra</h1>
          <p className="text-xl">
            Smart EV Charging Booking
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <Link 
            href="/bookingsPage/activePage" 
            className="border-r border-green-300 text-center">
                Ongoing
            </Link>

            <Link 
            href="/bookingsPage/historyPage">
              History
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
            <div className="mb-6 text-6xl">📄</div>

            <h2 className="text-2xl font-bold text-primary-green">
                No Booking History
            </h2>

            <p className="mt-2 max-w-sm text-text-secondary">
                You haven't completed any charging sessions yet.
                Your booking history will appear here after your sessions are finished.
            </p>

            <Link
                href="/stationPage"
                className="mt-8 rounded-xl bg-primary-green px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
                Book a Charging Station
            </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}