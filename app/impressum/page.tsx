import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum · Moriz Krämer",
  robots: { index: false },
};

// Personal details come from env vars (see .env.example) so they stay out of the repo.
// They are read at build time, so a change needs a redeploy.
function Field({ value, placeholder }: { value?: string; placeholder: string }) {
  return value ? <>{value}</> : <span className="ph">[{placeholder}]</span>;
}

export default function Impressum() {
  const env = process.env;
  return (
    <div className="wrap">
      <div className="bar">
        <Link className="quiet" href="/">← morizk.de</Link>
      </div>

      <main className="imp">
        <h1>Impressum</h1>
        <section className="imp-block">
          <h2>Angaben gemäß § 5 DDG</h2>
          <p>
            Moriz Krämer<br />
            <Field value={env.IMPRESSUM_STREET} placeholder="Straße Hausnummer" /><br />
            <Field value={env.IMPRESSUM_POSTCODE} placeholder="PLZ" /> {env.IMPRESSUM_CITY || "Hamburg"}<br />
            Deutschland
          </p>
        </section>
        <section className="imp-block">
          <h2>Kontakt</h2>
          <p>
            E-Mail: {env.IMPRESSUM_EMAIL || "info@morizk.de"}<br />
            Telefon: <Field value={env.IMPRESSUM_PHONE} placeholder="Telefonnummer" />
          </p>
        </section>
        <section className="imp-block">
          <h2>Verbraucherstreitbeilegung</h2>
          <p>Ich bin nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        </section>
      </main>

      <span />
    </div>
  );
}
