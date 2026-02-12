"use client";

interface LanguageSelectorProps {
  onSelect: (language: string) => void;
}

type Language = {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
  hoverColor: string;
  textColor: string;
};

const languages: Language[] = [
  {
    id: "javascript",
    name: "JavaScript",
    icon: "JS",
    bgColor: "bg-yellow-400",
    hoverColor: "hover:bg-yellow-500",
    textColor: "text-gray-900",
  },
  {
    id: "python",
    name: "Python",
    icon: "PY",
    bgColor: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    textColor: "text-white",
  },
  {
    id: "sql",
    name: "SQL",
    icon: "SQL",
    bgColor: "bg-blue-700",
    hoverColor: "hover:bg-blue-800",
    textColor: "text-white",
  },
  {
    id: "jsx",
    name: "React JSX",
    icon: "JSX",
    bgColor: "bg-cyan-400",
    hoverColor: "hover:bg-cyan-500",
    textColor: "text-gray-900",
  },
];

export default function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            <span className="text-primary">&lt;/&gt;</span> CODING TYPING TEST
          </h1>
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
        </div>
        <p className="text-lg text-gray-600 mt-4">
          Master your programming typing speed
        </p>
      </div>

      {/* Language Selection */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          SELECT YOUR LANGUAGE
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onSelect(lang.id)}
              className={`${lang.bgColor} ${lang.hoverColor} ${lang.textColor} rounded-xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 group`}
            >
              {/* Icon */}
              <div className="text-5xl font-bold mb-4 opacity-90 group-hover:opacity-100">
                {lang.icon}
              </div>

              {/* Language Name */}
              <div className="text-xl font-semibold">
                {lang.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pro Tip */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0">⌨️</div>
          <div>
            <p className="text-gray-700 font-medium">
              <span className="font-bold text-gray-900">Pro Tip:</span> Coding tests include brackets, semicolons, and special characters common in programming. Perfect for developers!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
