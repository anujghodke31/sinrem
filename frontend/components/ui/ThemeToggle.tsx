import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cn';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative flex items-center w-14 h-7 rounded-full border-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        isDark
          ? 'bg-zinc-800 border-zinc-600'
          : 'bg-gray-100 border-gray-300',
        className
      )}
    >
      {/* Track icons */}
      <Sun
        size={12}
        className={cn(
          'absolute left-1.5 transition-opacity duration-300',
          isDark ? 'opacity-30 text-zinc-400' : 'opacity-100 text-yellow-500'
        )}
      />
      <Moon
        size={12}
        className={cn(
          'absolute right-1.5 transition-opacity duration-300',
          isDark ? 'opacity-100 text-blue-400' : 'opacity-30 text-gray-400'
        )}
      />
      {/* Thumb */}
      <span
        className={cn(
          'absolute w-5 h-5 rounded-full shadow-md transition-all duration-300',
          isDark
            ? 'translate-x-7 bg-zinc-200'
            : 'translate-x-0.5 bg-white border border-gray-200'
        )}
      />
    </button>
  );
}
