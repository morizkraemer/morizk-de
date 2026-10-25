import Link from "next/link";
import Cues from "@/components/Cues";

export default function Home() {
  return (
    <div className="wrap">
      <header>
        <span className="mark">Moriz Krämer</span>
        <span className="live">Booking 2027</span>
      </header>

      <main>
        <Cues />
        <div className="after">
          <p className="more">+ everything else in between</p>
          <h1 className="intro">
            <b>Freelance, Hamburg and wherever the gig is.</b> Sound, light, video on buildings, and the code that ties it together.
          </h1>
        </div>
      </main>

      <footer>
        <a className="mail" href="mailto:info@morizk.de">info@morizk.de</a>
        <span className="foot-r">
          <Link className="quiet" href="/impressum">Impressum</Link>
          <span>morizk.de</span>
        </span>
      </footer>
    </div>
  );
}
