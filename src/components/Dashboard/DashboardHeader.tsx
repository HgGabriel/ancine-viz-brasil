import { Film } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-brazil p-8 md:p-12 text-white shadow-brazil mb-8">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Film className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Cinema Brasileiro
            </h1>
            <p className="text-white/90 text-lg mt-1">
              Dados Públicos ANCINE
            </p>
          </div>
        </div>
        <p className="text-white/80 text-sm md:text-base max-w-2xl">
          Explore os principais indicadores do mercado cinematográfico nacional,
          incluindo dados de bilheteria, produção, distribuição e exibição.
        </p>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
    </div>
  );
};
