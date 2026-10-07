export type Destination = {
  slug: string;
  name: string;
  country: string;
  tagline: string;
  nights: number;
  pricePerPerson: number;
  // Two colours for the card artwork, so the demo needs no image files.
  art: [string, string];
  code: string;
};

export const destinations: Destination[] = [
  {
    slug: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    tagline: "Tiled streets, tram 28 and sunsets over the Tagus.",
    nights: 4,
    pricePerPerson: 640,
    art: ["#F6AD55", "#ED8936"],
    code: "LIS",
  },
  {
    slug: "kyoto",
    name: "Kyoto",
    country: "Japan",
    tagline: "Temples, tea houses and the bamboo grove at dawn.",
    nights: 6,
    pricePerPerson: 1480,
    art: ["#F687B3", "#B83280"],
    code: "KIX",
  },
  {
    slug: "reykjavik",
    name: "Reykjavik",
    country: "Iceland",
    tagline: "Hot springs by day, northern lights by night.",
    nights: 5,
    pricePerPerson: 1120,
    art: ["#63B3ED", "#2B6CB0"],
    code: "KEF",
  },
  {
    slug: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    tagline: "Table Mountain, the winelands and two oceans.",
    nights: 7,
    pricePerPerson: 1290,
    art: ["#68D391", "#2F855A"],
    code: "CPT",
  },
  {
    slug: "queenstown",
    name: "Queenstown",
    country: "New Zealand",
    tagline: "Lakes, peaks and the adventure capital of the world.",
    nights: 8,
    pricePerPerson: 1950,
    art: ["#76E4F7", "#0987A0"],
    code: "ZQN",
  },
  {
    slug: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    tagline: "Souks, riads and the Atlas on the horizon.",
    nights: 4,
    pricePerPerson: 560,
    art: ["#FC8181", "#C53030"],
    code: "RAK",
  },
];
