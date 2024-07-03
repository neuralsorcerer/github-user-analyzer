import { ReactNode } from "react";
import "./globals.css";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="en">
      <head>
        <title>GitHub User Analyzer</title>
        <meta
          name="description"
          content="Analyze GitHub user profiles and their repositories."
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col">
        <header className="bg-pink-700 text-white py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl">GitHub User Analyzer</h1>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto px-4">
            <p>
              Built with ❤️ by{" "}
              <Link href="https://soumyadipsarkar.in">Soumyadip Sarkar</Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default Layout;
