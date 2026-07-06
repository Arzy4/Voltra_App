import Footer from "../components/footer";

export default function BookingsPage() {
  return (
    <main className="min-h-screen pb-24">

      <section className="px-4 pt-14 text-black">
        <div className="mt-4 rounded-2xl p-4 text-center">
          <p className="text-slate-400">No active booking yet.</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}