import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import NavBar from "@/components/NavBar";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";
import { ToastDescription } from "@radix-ui/react-toast";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RemindMe",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn(inter.className, "dark")}
        style={{ colorScheme: "dark" }}
      >
        <body>
          <Providers>
            <div className="flex min-h-screen w-full flex-col items-center">
              <NavBar />
              <Separator />
              <main className="flex flex-grow w-full justify-center items-center dark:bg-neutral-950">
                {children}
                <Toaster />
              </main>
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
