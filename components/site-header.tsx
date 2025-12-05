import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface SiteHeaderProps {
  showBackButton?: boolean;
  backUrl?: string;
  backText?: string;
}

export function SiteHeader({ showBackButton = false, backUrl = "/", backText = "Ana Sayfa" }: SiteHeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="CarBreeze Logo" 
            width={250} 
            height={100}
            priority
            className="h-auto w-auto max-h-16"
          />
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Ana Sayfa
            </Link>
            <Link href="/araclar" className="text-sm font-medium hover:text-primary">
              Araçlar
            </Link>
            <Link href="/kampanyalar" className="text-sm font-medium hover:text-primary">
              Kampanyalar
            </Link>
            <Link href="/hakkimizda" className="text-sm font-medium hover:text-primary">
              Hakkımızda
            </Link>
            <Link href="/iletisim" className="text-sm font-medium hover:text-primary">
              İletişim
            </Link>
            <Link href="/admin/giris" className="text-sm font-medium hover:text-primary">
              Admin Girişi
            </Link>
          </nav>
          {showBackButton && (
            <Button variant="ghost" asChild>
              <Link href={backUrl}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {backText}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

