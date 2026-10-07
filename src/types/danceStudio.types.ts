export type StudioSectionId = "hero" | "vision" | "classes" | "founders" | "reserve" | "plans" | "faq" | "visit";

export type StudioSection = { id: StudioSectionId; enabled: boolean };

export type StudioLink = { label: string; href: string };

export type StudioImage = { src: string; alt: string; position?: string };

export type StudioPalette = {
  canvas: string;
  surface: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  button: string;
  buttonInk: string;
};

export type StudioTypography = { body: string; mono: string };

export type StudioTheme = {
  id: string;
  className: string;
  palette: StudioPalette;
  typography: StudioTypography;
};

export type StudioFeature = { title: string; text: string; number: string };

export type Founder = { name: string; role: string; panel: "left" | "right"; image: StudioImage };

export type DanceStudioSite = {
  theme: StudioTheme;
  brand: string;
  address: string;
  navigation: readonly StudioLink[];
  hero: { title: string; cta: StudioLink; image: StudioImage };
  ticker: readonly string[];
  vision: { eyebrow: string; title: string; text: string; cta: StudioLink; image: StudioImage };
  classes: { eyebrow: string; title: string; text: string; cta: StudioLink; items: readonly StudioFeature[] };
  founders: { eyebrow: string; quote: string; people: readonly Founder[] };
  reserve: {
    title: string;
    text: string;
    bookingDemo: { title: string; serviceId: string; resourceId: string; timeZone: string; durationMinutes: number; storageKey: string };
  };
  footer: { email: string; phone: string; city: string };
  sections: readonly StudioSection[];
};
