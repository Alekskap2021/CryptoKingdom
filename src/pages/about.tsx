import { createFileRoute } from "@tanstack/react-router";

const AboutPage = () => {
 return (
  <main className="px-4 py-12">
   <section
    className="
      rounded-2xl p-6
      sm:p-8
    ">
    <p className="mbe-2">About</p>
    <h1
     className="
       mbe-3 text-4xl font-bold text-(--sea-ink)
       sm:text-5xl
     ">
     A small starter with room to grow.
    </h1>
    <p className="m-0 max-w-3xl text-base/8 text-(--sea-ink-soft)">
     TanStack Start gives you type-safe routing, server functions, and modern SSR defaults. The
     project structure now keeps global concerns in <code>app</code>, route-level code in{" "}
     <code>pages</code>, and shared infrastructure in <code>shared</code>.
    </p>
   </section>
  </main>
 );
};

export const Route = createFileRoute("/about")({
 component: AboutPage,
});
