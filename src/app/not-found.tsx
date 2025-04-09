import Link from "next/link";

export default function NotFoundPage() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
        <h1 className="text-4xl font-bold">❌ Page non trouvée</h1>
        <p className="mt-4 text-lg">Le message secret que vous cherchez n'existe pas.</p>
        <Link href="/" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Retour à l'accueil
        </Link>
      </div>
    );
  }
  