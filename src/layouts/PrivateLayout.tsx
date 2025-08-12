import { useState } from "react";
import { PrivateHeader } from "../components/PrivateHeader";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface PrivateLayoutProps {
  children: React.ReactNode;
  isDashboard?: boolean;
}

export const PrivateLayout = ({ children, isDashboard = false }: PrivateLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - ocupa toda la altura de la ventana */}
      <div
        className={`bg-navbar transition-all duration-300 ease-in-out sticky top-0 self-start   ${
          isSidebarOpen ? "w-[4em] md:w-[13em] lg:w-[15em] 2xl:w-[17em]" : "w-0"
        } overflow-hidden h-screen`}
      >
        <div className={`h-full transition-opacity duration-300  ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
          <Navbar />
        </div>
      </div>

      {/* CAMBIO: Contenedor principal que incluye header y main */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Header - se ajusta al ancho disponible */}
        <PrivateHeader isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} isMessage={isDashboard} />

        {/* Main */}
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      
    </div>
  );
};