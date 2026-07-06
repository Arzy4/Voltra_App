import Link from "next/link";

export default function footer() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[20px] shadow-[0_-8px_20px_rgba(0,0,0,0.1)] text-black">
      <div className="mx-auto flex max-w-md justify-around px-4 py-3 text-xs">
        <Link href="/" className="flex flex-col items-center gap-1">
          <span>🏠</span>
          <span>Home</span>
        </Link>

        <Link href="/stationPage" className="flex flex-col items-center gap-1">
          <span>⚡</span>
          <span>Stations</span>
        </Link>

        <Link href="/bookingsPage" className="flex flex-col items-center gap-1">
          <span>📅</span>
          <span>Bookings</span>
        </Link>

        <Link href="/profilePage" className="flex flex-col items-center gap-1">
          <span>👤</span>
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}