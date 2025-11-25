export type DbNavLink = {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
  subLinks?: DbNavLink[];
};

export type DbNavColumn = {
  heading: string;
  links: DbNavLink[];
};

export type DbNavSection = {
  id: string;
  label: string;
  href: string;
  intro?: string;
  introCtaLabel?: string;
  columns?: DbNavColumn[];
  standaloneLinks?: DbNavLink[];
};

export const dbNavSections: DbNavSection[] = [
  {
    id: "konzern",
    label: "Konzern",
    href: "/de/konzern",
    intro: "Strategie, Profil und People Themen",
    introCtaLabel: "Zur Seite",
    columns: [
      {
        heading: "Konzernprofil",
        links: [
          {
            label: "Die DB in Zahlen",
            href: "/de/konzern/konzernprofil/zahlen_fakten",
            subLinks: [
              { label: "Geschäftszahlen", href: "/de/konzern/konzernprofil/zahlen_fakten/geschaeftszahlen" },
              { label: "Nachhaltigkeitskennzahlen", href: "/de/konzern/konzernprofil/zahlen_fakten/nachhaltigkeit" },
              { label: "Jahresberichte", href: "/de/konzern/konzernprofil/zahlen_fakten/jahresberichte" },
            ],
          },
          { label: "Vorstand & Aufsichtsrat", href: "/de/konzern/konzernprofil/Vorstand_neu" },
          { label: "Compliance & Datenschutz", href: "/de/konzern/konzernprofil/compliance" },
        ],
      },
      {
        heading: "Diversity im Konzern",
        links: [
          { label: "Einziganders", href: "/de/konzern/Menschen-Einziganders-/Einziganders--10365240" },
          { label: "Diversity Dimensionen", href: "/de/konzern/Menschen-Einziganders-/Diversity-Dimensionen--10365284" },
          { label: "Pat:innenschaften", href: "/de/konzern/Menschen-Einziganders-/Pat-innenschaften-10374446" },
        ],
      },
      {
        heading: "Arbeit der Zukunft",
        links: [
          { label: "Menschen. Machen. Zukunft.", href: "/de/konzern/Arbeit-der-Zukunft/Menschen-Machen-Zukunft--6879818" },
          { label: "Woche der Neuen Arbeit", href: "/de/konzern/Arbeit-der-Zukunft/Woche-der-Neuen-Arbeit-2025-6879714" },
          { label: "Modernes Arbeiten", href: "/de/konzern/Arbeit-der-Zukunft/Zukunft-Modernes-Arbeiten-13619394" },
        ],
      },
    ],
  },
  {
    id: "newsroom",
    label: "Newsroom",
    href: "/de/presse",
    intro: "Presseinformationen, Drehanfragen und Kontakt",
    introCtaLabel: "Zur Seite",
    columns: [
      {
        heading: "Presseinformationen",
        links: [
          { label: "Presse zentral", href: "/de/presse/pressestart_zentrales_uebersicht" },
          { label: "Presse regional", href: "/de/presse/presse-regional" },
          { label: "Medienpakete", href: "/de/presse/suche_Medienpakete" },
        ],
      },
      {
        heading: "Services",
        links: [
          { label: "Pressekontakt", href: "/de/presse/kontakt-6868656" },
          { label: "Drehanfragen", href: "/de/presse/drehgenehmigung-6868464" },
          { label: "Presseverteiler", href: "/de/presse/presseverteiler-6868496" },
        ],
      },
    ],
  },
  {
    id: "investoren",
    label: "Investoren",
    href: "/de/landingpage_ir-6897962",
    intro: "Kennzahlen und Investor Relations",
    columns: [
      {
        heading: "Capital Markets",
        links: [
          { label: "Anleihen & Ratings", href: "/de/landingpage_ir-6897962/anleihen" },
          { label: "Berichte & Präsentationen", href: "/de/landingpage_ir-6897962/reports" },
        ],
      },
      {
        heading: "Kontakt",
        links: [
          { label: "IR Ansprechpartner", href: "/de/landingpage_ir-6897962/kontakt" },
          { label: "Finanzkalender", href: "/de/landingpage_ir-6897962/kalender" },
        ],
      },
    ],
  },
  {
    id: "karriere",
    label: "Karriere",
    href: "https://db.jobs/de-de",
    standaloneLinks: [
      { label: "Stellenangebote", href: "https://db.jobs/de-de", external: true },
      { label: "Ausbildung & Studium", href: "/de/karriere", external: false },
      { label: "Benefits", href: "/de/karriere/benefits", external: false },
    ],
  },
  {
    id: "digitalisierung",
    label: "Digitalisierung",
    href: "/de/Digitalisierung",
    columns: [
      {
        heading: "Digital für Kund:innen",
        links: [
          { label: "Im Fokus", href: "/de/Digitalisierung/technologie/Im-Fokus" },
          { label: "Digital im Konzern", href: "/de/Digitalisierung/technologie/Digital_im_Konzern" },
        ],
      },
      {
        heading: "Startups & Innovation",
        links: [
          {
            label: "DB mindbox",
            href: "/de/Digitalisierung/startups/dbmindbox-6898904",
            subLinks: [
              { label: "Programm", href: "/de/Digitalisierung/startups/dbmindbox-6898904/programm" },
              { label: "Portfolio", href: "/de/Digitalisierung/startups/dbmindbox-6898904/portfolio" },
              { label: "Bewerbung", href: "/de/Digitalisierung/startups/dbmindbox-6898904/bewerbung" },
            ],
          },
          { label: "Beyond1435", href: "/de/Digitalisierung/startups/Beyond1435-6898896" },
          { label: "Digitale Schiene", href: "/de/Digitalisierung/digitaleschiene-6898730" },
        ],
      },
    ],
  },
  {
    id: "nachhaltigkeit",
    label: "Nachhaltigkeit",
    href: "/de/nachhaltigkeit",
    columns: [
      {
        heading: "Transformation",
        links: [
          { label: "Die grüne Transformation", href: "https://nachhaltigkeit.deutschebahn.com/de/gruene-transformation", external: true },
          { label: "Soziale Verantwortung", href: "https://nachhaltigkeit.deutschebahn.com/de/soziale-verantwortung", external: true },
          { label: "Das ist grün.", href: "/de/nachhaltigkeit/dasistgruen-6854084" },
        ],
      },
      {
        heading: "Engagement",
        links: [
          { label: "Bahn-Azubis gegen Hass & Gewalt", href: "/de/nachhaltigkeit/verantwortung_gesellschaft/BAgHG" },
          { label: "Unfallprävention", href: "/de/nachhaltigkeit/verantwortung_gesellschaft/unfallpraevention" },
          { label: "Sponsoring", href: "/de/nachhaltigkeit/verantwortung_gesellschaft/Sponsoring" },
        ],
      },
    ],
  },
];

