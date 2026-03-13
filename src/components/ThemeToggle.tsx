import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "icon" | "default";
}

const ThemeToggle = ({ className = "", variant = "ghost", size = "icon" }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant={variant} size={size} onClick={toggleTheme} className={className} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
};

export default ThemeToggle;
