import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Test Your Typing Speed - Free WPM Test
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Measure your words per minute (WPM) and accuracy with our free online typing test.
            No download or registration required.
          </p>

          <Link
            href="/test"
            className="inline-block bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Start Typing Test
          </Link>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">✓</div>
            <h3 className="font-semibold text-gray-900 mb-2">100% Free</h3>
            <p className="text-gray-600 text-sm">
              No hidden fees or premium plans
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">✓</div>
            <h3 className="font-semibold text-gray-900 mb-2">No Registration</h3>
            <p className="text-gray-600 text-sm">
              Start testing immediately
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">✓</div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
            <p className="text-gray-600 text-sm">
              Get detailed metrics right away
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Click Start</h3>
              <p className="text-gray-600">
                Click the start button to begin your 60-second typing challenge
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Type the Text</h3>
              <p className="text-gray-600">
                Type the displayed passage as quickly and accurately as possible
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">View Results</h3>
              <p className="text-gray-600">
                See your WPM, accuracy percentage, and error count instantly
              </p>
            </div>
          </div>
        </div>

        {/* AdSense Placeholder */}
        {/* AdSense ad unit - Homepage bottom */}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Typing Speed Test. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
