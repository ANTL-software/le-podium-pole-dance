import type { CSSProperties } from "react";
import type { DanceStudioSite } from "../types/danceStudio.types";

export function getThemeStyle(theme: DanceStudioSite["theme"]): CSSProperties & Record<`--studio-${string}`, string> {
  const { palette, typography } = theme;
  return {
    "--studio-canvas": palette.canvas, "--studio-surface": palette.surface,
    "--studio-ink": palette.ink, "--studio-muted": palette.muted,
    "--studio-line": palette.line, "--studio-accent": palette.accent,
    "--studio-button": palette.button, "--studio-button-ink": palette.buttonInk,
    "--studio-font-body": typography.body, "--studio-font-mono": typography.mono,
  };
}
