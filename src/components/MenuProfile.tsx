import { LuLogOut, LuUser } from "react-icons/lu"
import fotoPerfil from "../assets/FotoPerfil.png"
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useAuth0 } from "@auth0/auth0-react";

interface MenuProfileProps {
    isVisible: boolean;
}

// Función para truncar el nombre si es muy largo
const truncateName = (name: string, maxLength: number = 20): string => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
};

export const MenuProfile = ({ isVisible }: MenuProfileProps) => {
    const navigate = useNavigate();
    const { userData, isLoading, auth0User } = useUser();
    const { logout } = useAuth0();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleLogout = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    // Usar la foto de Auth0 si existe, sino la por defecto
    const profilePicture = auth0User?.picture || fotoPerfil;
    // Usar el nombre del backend, sino el de Auth0, sino "Usuario"
    const userName = truncateName(userData?.name || auth0User?.name || "Usuario", 20);

    return (
        <div className={`flex flex-col items-start justify-center gap-2 rounded-lg text-white w-[18em] px-10 py-7 bg-primary border border-white/20 ${isVisible ? 'menu-appear' : 'menu-disappear'}`}>
            <div className="flex items-center gap-4">
                <img 
                    src={profilePicture} 
                    alt="fotoPerfil" 
                    className="w-[2.5em] h-[2.5em] rounded-full object-cover" 
                />
                <p className="font-extrabold text-[12px] uppercase">
                    {isLoading ? "Cargando..." : userName}
                </p>
            </div>
            <hr className="border border-t-white/20 w-full" />

            <div className="flex flex-col  py-2 w-full gap-2">

                <div className="flex items-center gap-4 cursor-pointer hover:bg-white/5 rounded-[5px] transition-colors py-2" onClick={() => handleNavigation('/myProfile')}>
                    <div className="w-[2.5em] flex justify-center">
                        <LuUser strokeWidth={3} className="" />

                    </div>
                    <p className="w-[8em] text-[13px]  ">Mi perfil</p>
                </div>


                <div className="flex items-center gap-4 cursor-pointer hover:bg-white/5 rounded-[5px] transition-colors py-2" onClick={handleLogout}>
                    <div className="w-[2.5em] flex justify-center">
                        <LuLogOut strokeWidth={3} className="" />

                    </div>
                    <p className="w-[8em] text-[13px]">Cerrar sesión</p>
                </div>

            </div>


        </div>
    )
}
