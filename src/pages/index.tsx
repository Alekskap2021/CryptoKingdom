// eslint-disable-next-line @conarti/feature-sliced/public-api
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

const starterHighlights = [
 ["Type-Safe Routing", "Routes and links stay in sync across every page."],
 ["Server Functions", "Call server code from your UI without creating API boilerplate."],
 ["Streaming by Default", "Ship progressively rendered responses for faster experiences."],
 ["Tailwind Native", "Design quickly with utility-first styling and reusable tokens."],
] as const;

export const HomePage = () => {
 return (
  <main className="px-4 pbs-14 pbe-8">
   <section
    className="
      relative overflow-hidden rounded-4xl px-6 py-10
      sm:px-10 sm:py-14
    ">
    <div
     className="
       pointer-events-none absolute -inset-s-20 -inset-bs-24 size-56
       rounded-full
       bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]
     "
    />
    <div
     className="
       pointer-events-none absolute -inset-e-20 -inset-be-20 size-56
       rounded-full
       bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]
     "
    />
    <p className="mbe-3">TanStack Start Base Template</p>
    <h1
     className="
       mbe-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight
       text-(--sea-ink)
       sm:text-6xl
     ">
     Start simple, ship quickly.
    </h1>
    <p
     className="
       mbe-8 max-w-2xl text-base text-(--sea-ink-soft)
       sm:text-lg
     ">
     This starter now follows a minimal Feature-Sliced Design structure: app-wide wiring in{" "}
     <code>app</code>, route ownership in <code>pages</code>, and neutral infrastructure in{" "}
     <code>shared</code>.
    </p>
    <div className="flex flex-wrap gap-3">
     <Link
      className="
        rounded-full border border-[rgba(50,143,151,0.3)]
        bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold
        text-(--lagoon-deep) no-underline transition
        hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]
      "
      to="/about">
      About This Starter
     </Link>
     <a
      className="
        rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-5 py-2.5
        text-sm font-semibold text-(--sea-ink) no-underline transition
        hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]
      "
      href="https://tanstack.com/router"
      rel="noopener noreferrer"
      target="_blank">
      Router Guide
     </a>
    </div>
   </section>

   <section
    className="
      mbs-8 grid gap-4
      sm:grid-cols-2
      lg:grid-cols-4
    ">
    {starterHighlights.map(([title, description], index) => (
     <article
      className="rounded-2xl p-5"
      key={title}
      style={{ animationDelay: `${index * 90 + 80}ms` }}>
      <h2 className="mbe-2 text-base font-semibold text-(--sea-ink)">{title}</h2>
      <p className="m-0 text-sm text-(--sea-ink-soft)">{description}</p>
     </article>
    ))}
   </section>

   <section className="mbs-8 rounded-2xl p-6">
    <p className="mbe-2">Quick Start</p>
    <ul className="m-0 list-disc space-y-2 ps-5 text-sm text-(--sea-ink-soft)">
     <li>
      Edit <code>src/pages/home/ui/home-page.tsx</code> to customize the home page.
     </li>
     <li>
      Update <code>src/app/layout/site-header.tsx</code> and{" "}
      <code>src/app/layout/site-footer.tsx</code> for brand links.
     </li>
     <li>
      Keep <code>src/routes</code> thin and put route logic into page slices.
     </li>
    </ul>
   </section>
  </main>
 );
};

export const Route = createFileRoute("/")({ component: HomePage });
