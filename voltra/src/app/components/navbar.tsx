export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-primary-green px-6 py-6 border-bottom-2 rounded-b-[20px]">
      <div className="mb-3 text-white h-[10svh]">
        <h1 className="text-2xl font-bold">Voltra</h1>
        <p className="text-xl">
          Smart EV Charging Booking
        </p>
      </div>

      <div className="absolute -bottom-8 left-4 right-4">
        <input
          type="text"
          placeholder="Search charging station..."
          className="w-full rounded-xl bg-white px-4 py-4 shadow-lg border-1 border-gray-300 text-black placeholder:text-gray-400"
        />
      </div>
    </header>
  );
}