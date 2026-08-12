import IQTestApp from "@/components/IQTestApp";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-sky-100 via-fuchsia-50 to-orange-100 px-4 py-10">
      <main className="w-full max-w-2xl rounded-3xl bg-white/90 p-6 shadow-xl sm:p-10">
        <IQTestApp />
      </main>
    </div>
  );
}
