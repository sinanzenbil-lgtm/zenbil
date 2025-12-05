import { Car, Wrench, Mail } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <Car className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 tracking-tight">
            zenbil<span className="text-cyan-400">.com</span>
          </h1>
        </div>

        {/* Under Construction Badge */}
        <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 px-6 py-3 rounded-full mb-8 backdrop-blur-sm">
          <Wrench className="w-5 h-5 animate-bounce" />
          <span className="font-semibold text-lg">Yapım Aşamasında</span>
          <Wrench className="w-5 h-5 animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Description */}
        <p className="text-xl md:text-2xl text-blue-100/80 mb-6 leading-relaxed">
          Sitemiz şu anda yapım aşamasındadır.
        </p>
        <p className="text-lg text-blue-200/60 mb-12">
          Çok yakında sizlerle buluşacağız!
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="flex justify-between text-sm text-blue-300/60 mb-2">
            <span>İlerleme</span>
            <span>Yakında...</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-full animate-shimmer"
              style={{ width: '65%' }}
            ></div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-200/70">
          <a 
            href="mailto:info@zenbil.com" 
            className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span>info@zenbil.com</span>
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center text-blue-300/40 text-sm">
        <p>&copy; 2024 zenbil.com - Tüm hakları saklıdır.</p>
      </div>
    </div>
  );
}
