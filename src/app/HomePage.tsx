import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Link href={"/yurbo/create"} className="rounded-lg border-2 border-white">
        Host a new Event
      </Link>

      <Link href={"/event/create"} className="rounded-lg border-2 border-white">
        Create a new Event type
      </Link>

      <Link href={"/map"} className="rounded-lg border-2 border-white">
        Check out current Events
      </Link>
    </div>
  );
}
