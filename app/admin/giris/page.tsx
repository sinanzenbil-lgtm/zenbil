"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Car } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Get form data directly from form elements
    const form = e.target as HTMLFormElement;
    const emailInput = form.querySelector('#email') as HTMLInputElement;
    const passwordInput = form.querySelector('#password') as HTMLInputElement;
    
    const email = emailInput?.value || formData.email;
    const password = passwordInput?.value || formData.password;

    console.log("Form data:", { email, password: password ? "***" : "empty", formDataEmail: formData.email });

    if (!email || !password) {
      toast.error("Lütfen email ve şifre girin");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("SignIn result:", result);

      if (result?.error) {
        console.error("Login error:", result.error);
        toast.error(`Giriş hatası: ${result.error}`);
      } else if (result?.ok) {
        console.log("Login successful, redirecting...");
        toast.success("Giriş başarılı! Yönlendiriliyor...");
        // Hard redirect to ensure session is properly loaded
        setTimeout(() => {
          window.location.href = "/admin";
        }, 500);
      } else {
        console.error("Unexpected result:", result);
        toast.error("Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.");
      }
    } catch (error) {
      console.error("Login exception:", error);
      toast.error("Bir hata oluştu: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-2">
            <Car className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">CarBreeze Admin</CardTitle>
          <CardDescription>
            Yönetim paneline giriş yapmak için bilgilerinizi girin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@carbreeze.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Test hesabı: admin@carbreeze.com / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
