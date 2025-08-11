import { useState } from "react";
import { PrivateHeader } from "../components/PrivateHeader";
import { Navbar } from "../components/Navbar";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="h-screen flex">
      {/* CAMBIO: Sidebar ahora está al mismo nivel que el contenido principal */}
      {/* Sidebar - ocupa toda la altura de la ventana */}
      <div
        className={`bg-navbar transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-[4em] md:w-[13em] lg:w-[15em] 2xl:w-[17em]" : "w-0"
        } overflow-hidden h-screen`}
      >
        <div className={`w-[20vw] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
          <Navbar />
        </div>
      </div>

      {/* CAMBIO: Contenedor principal que incluye header y main */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Header - se ajusta al ancho disponible */}
        <PrivateHeader isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />

        {/* Main */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};