import React from 'react';
import { Moon, Sun } from "lucide-react";
import { Button } from "./Button";
import { useTheme } from "../../context/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const next = theme === "light" ? "dark" : "light";

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(next)}
      className="rounded-xl px-3 py-2"
    >
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      <span className="hidden sm:inline">{theme === "light" ? "Dark" : "Light"}</span>
    </Button>
  );
}