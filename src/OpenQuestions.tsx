// Second page of the prototype: the questions we could not answer from the
// Network Canvas protocol alone, collected so the researcher gets the
// prototype and the questions in one link.

type Question = {
  title: string;
  context: string;
  ask: string;
  links?: { label: string; href: string }[];
};

const questions: Question[] = [
  {
    title: "Vervolgvraag bij “Anders ...” (stap 2, Relatie)",
    context:
      "In Network Canvas verschijnt na het slepen naar “Anders ...” een venster met de vraag “Wil je een opmerking toevoegen aan deze persoon?”. Dat leest als een optionele, algemene opmerking, maar het antwoord is verplicht en komt in het veld comment terecht.",
    ask: "Is de bedoeling hier “welke relatie is het dan?” Zo ja, mogen we de vraag zo formuleren?",
    links: [{ label: "Bekijk stap 2", href: "/?stage=1" }],
  },
  {
    title: "Schaal van “Emotionele steun” (stap 7)",
    context:
      "In het codeboek loopt deze vraag van 1 (Nooit) tot 5 (Bijna altijd). Alle andere frequentievragen lopen van 0 tot 4. Hetzelfde antwoord “Nooit” is daardoor bij de ene vraag een 0 en bij de andere een 1.",
    ask: "Is dat bewust, of mogen we alle frequentieschalen gelijktrekken naar 0 tot 4?",
    links: [{ label: "Bekijk stap 7", href: "/?stage=6" }],
  },
  {
    title: "Wie bedient het scherm?",
    context:
      "Personen worden gesorteerd door ze in kolommen te slepen, zoals in Network Canvas. Het prototype voegt daar klikken op een kolom en de cijfertoetsen aan toe.",
    ask: "Vult de behandelaar het samen met de cliënt in, of bedient de cliënt het zelf? Dat bepaalt hoe zwaar slepen en aanraken wegen ten opzichte van het toetsenbord.",
    links: [{ label: "Bekijk stap 2", href: "/?stage=1" }],
  },
  {
    title: "Cirkels op het sociogram (stap 12)",
    context:
      "Network Canvas toont op de achtergrond van het sociogram tien concentrische cirkels. Het prototype tekent die nu niet, maar slaat de positie van elke persoon wel op.",
    ask: "Betekenen de cirkels iets (bijvoorbeeld nabijheid tot de cliënt in het midden) en wordt de positie geanalyseerd? Of zijn ze alleen een hulpmiddel bij het neerleggen?",
    links: [{ label: "Bekijk stap 12", href: "/?stage=11" }],
  },
  {
    title: "Wat een verbinding betekent (stap 12)",
    context:
      "In het protocol is er één soort verbinding (“tie”), zonder richting en zonder eigenschappen. De vraag luidt “Wie heeft contact met wie?”.",
    ask: "Klopt het dat over een verbinding verder niets gevraagd hoeft te worden, zoals hoe goed twee personen elkaar kennen?",
  },
];

export function OpenQuestions() {
  return (
    <main className="questions">
      <a href="/" className="back">
        ← Terug naar het interview
      </a>
      <h1>Open vragen</h1>
      <p className="hint">
        Dingen die uit het Network Canvas-protocol niet eenduidig volgen. De antwoorden bepalen hoe het definitieve
        instrument in het EPD gebouwd wordt.
      </p>
      <ol>
        {questions.map((q) => (
          <li key={q.title}>
            <h2>{q.title}</h2>
            <p>{q.context}</p>
            <p className="ask">{q.ask}</p>
            {q.links && (
              <p className="links">
                {q.links.map((l) => (
                  <a key={l.href} href={l.href}>
                    {l.label}
                  </a>
                ))}
              </p>
            )}
          </li>
        ))}
      </ol>
    </main>
  );
}
