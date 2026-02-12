"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";
import CodeTypingTest from "@/components/CodeTypingTest";
import codeSnippets from "@/data/code-snippets.json";

interface CodeSnippet {
  id: string;
  language: string;
  difficulty: string;
  description: string;
  code: string;
}

export default function CodeTestPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet | null>(null);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);

    // Filter snippets by language
    const languageSnippets = (codeSnippets as CodeSnippet[]).filter(
      (s) => s.language === language
    );

    // Select random snippet from this language
    if (languageSnippets.length > 0) {
      const randomSnippet = languageSnippets[
        Math.floor(Math.random() * languageSnippets.length)
      ];
      setCurrentSnippet(randomSnippet);
    }
  };

  const handleBack = () => {
    setSelectedLanguage(null);
    setCurrentSnippet(null);
  };

  return (
    <main className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Back to Home Link */}
        {!selectedLanguage && (
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-block text-primary hover:text-blue-600 font-semibold mb-4"
            >
              ← Back to Home
            </Link>
          </div>
        )}

        {/* Language Selection or Typing Test */}
        {!selectedLanguage ? (
          <LanguageSelector onSelect={handleLanguageSelect} />
        ) : currentSnippet ? (
          <CodeTypingTest snippet={currentSnippet} onBack={handleBack} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading snippet...</p>
          </div>
        )}

        {/* Footer */}
        {!selectedLanguage && (
          <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} Typing Speed Test. All rights reserved.</p>
          </footer>
        )}
      </div>
    </main>
  );
}
