export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
                <div className="text-center">
                    <h1 className="text-6xl font-bold mb-4">
                        🚀 Liora
                    </h1>
                    <p className="text-2xl text-gray-600 mb-8">
                        Landing Page - Next.js 14
                    </p>
                    <div className="flex gap-4 justify-center">
                        <a
                            href="#"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Get Started
                        </a>
                        <a
                            href="#"
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        </main>
    )
}
