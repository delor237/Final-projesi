import { defineConfig, Preset } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";
import presetAutoprefix from "@twind/preset-autoprefix";

export default {
  ...defineConfig({
    presets: [presetTailwind() as Preset, presetAutoprefix() as Preset],
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          brand: {
            50: "#f0f9ff",
            100: "#e0f2fe",
            200: "#bae6fd",
            300: "#7dd3fc",
            400: "#38bdf8",
            500: "#0ea5e9",
            600: "#0284c7",
            700: "#0369a1",
            800: "#075985",
            900: "#0c4a6e",
          },
          slate: {
            50: "#f8fafc",
            900: "#0f172a",
          },
        },
        fontFamily: {
          sans: ["Inter", "system-ui", "sans-serif"],
          display: ["Outfit", "sans-serif"],
        },
        animation: {
          "fade-in-up": "fade-in-up 0.5s ease-out forwards",
          "scale-in": "scale-in 0.2s ease-out forwards",
        },
        keyframes: {
          "fade-in-up": {
            "0%": { opacity: "0", transform: "translateY(10px)" },
            "100%": { opacity: "1", transform: "translateY(0)" },
          },
          "scale-in": {
            "0%": { opacity: "0", transform: "scale(0.95)" },
            "100%": { opacity: "1", transform: "scale(1)" },
          },
        },
      },
    },
  }),
  selfURL: import.meta.url,
};
