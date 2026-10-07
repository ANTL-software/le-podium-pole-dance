import { danceStudioSite } from "../content/danceStudio";
import { useStudioDemo } from "../contexts/StudioDemoContext";

export function useDanceStudioPage() {
  const studio = useStudioDemo();
  return { site: { ...danceStudioSite, classes: { ...danceStudioSite.classes, items: studio.services } } };
}
