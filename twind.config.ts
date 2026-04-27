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
            50: "#eff6ff",
            100: "#dbeafe",
            500: "#3b82f6",
            600: "#2563eb",
            900: "#1e3a8a",
          },
        },
      },
    },
  }),
  selfURL: import.meta.url,
};
