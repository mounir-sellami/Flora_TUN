import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "جرد النباتات في تونس | خرائط التوزيع والمحافظة عليها",
  description:
    "منصة وطنية تفاعلية لجرد النباتات في تونس، رسم خرائط توزيعها الجغرافي حسب الولايات والنطاقات البيئية، والمحافظة على النباتات المهددة عبر الأراضي المحمية والمشاهدات الميدانية.",
  keywords: [
    "النباتات في تونس",
    "جرد النباتات",
    "خرائط التوزيع",
    "المحافظة على النباتات",
    "flores de Tunisie",
    "biodiversité Tunisie",
  ],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@300;400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
