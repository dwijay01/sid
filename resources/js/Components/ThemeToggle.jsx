import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/Contexts/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="-m-2.5 p-2.5 text-slate-400 hover:text-amber-500 dark:hover:text-amber-300 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Toggle theme"
            title="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun className="h-6 w-6" aria-hidden="true" />
            ) : (
                <Moon className="h-6 w-6" aria-hidden="true" />
            )}
        </button>
    );
}
