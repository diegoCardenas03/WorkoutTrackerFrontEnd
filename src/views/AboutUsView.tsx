import { LuUsers, LuZap, LuSmartphone, LuChartNoAxesCombined, LuFileText, LuUserCheck, LuTarget } from "react-icons/lu"
import { ForGymCard } from "../components/about/cards/ForGymCard"
import { ResultsCard } from "../components/about/cards/ResultsCard"
import { WhyChoiceUsCard } from "../components/about/cards/WhyChoiceUsCard"
import { OurHistoryCard } from "../components/about/cards/OurHistoryCard"
import { CallToActionCard } from "../components/about/cards/CallToActionCard"
import { Header } from "../components/PublicHeader"
import { Footer } from "../components/Footer"

export const AboutUsView = () => {
    const whyChooseUsFeatures = [
        {
            icon: <LuUsers className="text-white" size={32} />,
            title: "Gestión de miembros",
            description: "Permite a tu gimnasio crear y administrar perfiles de todos tus miembros desde un panel centralizado."
        },
        {
            icon: <LuSmartphone className="text-white" size={32} />,
            title: "App Personalizada",
            description: "Cada gimnasio obtiene su propia versión de la app con su marca y colores corporativos."
        },
        {
            icon: <LuChartNoAxesCombined className="text-white" size={32} />,
            title: "Analytics Avanzados",
            description: "Obtén insights detallados sobre el uso, progreso y retención de tus miembros."
        },
        {
            icon: <LuFileText className="text-white" size={32} />,
            title: "Multi-ubicación",
            description: "Gestiona múltiples sucursales desde una sola plataforma administrativa."
        },
        {
            icon: <LuUserCheck className="text-white" size={32} />,
            title: "Comunidad Interna",
            description: "Fomenta la interacción entre tus miembros con un sistema de comunidad exclusivo."
        },
        {
            icon: <LuTarget className="text-white" size={32} />,
            title: "Retención Mejorada",
            description: "Aumenta la retención de miembros con seguimientos personalizados y gamificación."
        }
    ]

    return (

        <>
            <Header />

            <div className="min-h-screen bg-primary px-4 flex flex-col gap-10">
                {/* Hero Section */}

                <div className="max-w-7xl mx-auto mt-14">
                    {/* Header */}
                    <div className="text-center mb-3">
                        <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4">
                            WorkoutTracker para Gimnasios
                        </h1>
                        <p className="text-quaternary text-base sm:text-lg 2xl:text-xl max-w-4xl mx-auto leading-relaxed">
                            La plataforma integral que necesita tu gimnasio para gestionar miembros, crear entrenamientos
                            personalizados y aumentar la retención. Tu marca, nuestra tecnología
                        </p>
                    </div>

                </div>

                <div className="flex flex-col lg:flex-row justify-between gap-5">
                    <ForGymCard
                        icon={<LuUsers className="text-white" size={24} />}
                        title="Para Gimnasios Modernos"
                        description="FitApp es una solución SaaS diseñada específicamente para gimnasios que buscan digitalizar su operación, mejorar la experiencia de sus miembros y aumentar la retención a través de tecnología de vanguardia."
                    />

                    <ForGymCard
                        icon={<LuZap className="text-white" size={24} />}
                        title="Implementación Rápida"
                        description="Configura tu gimnasio en menos de 48 horas. Nuestro equipo se encarga de la configuración inicial, migración de datos y capacitación del personal para que puedas empezar inmediatamente."
                    />
                </div>

                {/* Results Section */}
                <section>
                    <ResultsCard />
                </section>



                {/* Why Choose Us Section */}
                <section className="bg-primary ">
                    <div className="">
                        {/* Header */}
                        <div className="text-center mb-16">
                            <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                                ¿Por qué elegir WorkoutTracker?
                            </h2>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                            {whyChooseUsFeatures.map((feature, index) => (
                                <WhyChoiceUsCard
                                    key={index}
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our History Section */}
                <section>
                    <OurHistoryCard />
                </section>

                {/* Call to Action Section */}
                <section className="mb-10">
                    <CallToActionCard />
                </section>
            </div>
            <Footer />
        </>
    )
}
