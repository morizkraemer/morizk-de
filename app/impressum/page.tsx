import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum · Moriz Krämer",
  robots: { index: false },
};

export default function Impressum() {
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
            <span className="ph">[Straße Hausnummer]</span><br />
            <span className="ph">[PLZ] Hamburg</span><br />
            Deutschland
          </p>
        </section>
        <section className="imp-block">
          <h2>Kontakt</h2>
          <p>
            E-Mail: info@morizk.de<br />
            Telefon: <span className="ph">[Telefonnummer]</span>
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
