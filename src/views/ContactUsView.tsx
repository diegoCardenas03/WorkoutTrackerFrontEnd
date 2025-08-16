import { LuMail, LuPhone, LuClock } from "react-icons/lu"
import { WayToContactCard } from "../components/contact/cards/WayToContactCard"
import { ContactForInfoCard } from "../components/contact/cards/ContactForInfoCard"
import { FrequentQuestionsCard } from "../components/contact/cards/FrequentQuestionsCard"
import { ImplementAverageCard } from "../components/contact/cards/ImplementAverageCard"
import { Footer } from "../components/Footer"
import { Header } from "../components/PublicHeader"

export const ContactUsView = () => {
  const contactMethods = [
    {
      icon: <LuMail className="text-white" size={50} />,
      title: "Email de Ventas",
      contacts: [
        "ventas@fitapp.com",
        "soporte@fitapp.com"
      ]
    },
    {
      icon: <LuPhone className="text-white" size={50} />,
      title: "Teléfono Comercial",
      contacts: [
        "+1 (555) 123-4567",
        "Ext. 101 - Ventas"
      ]
    },
    {
      icon: <LuClock className="text-white" size={50} />,
      title: "Horarios de Atención",
      contacts: [
        "Lunes a Viernes: 9:00 - 18:00",
        "Sábados: 10:00 - 14:00"
      ]
    }
  ]

  return (

    <>
      <Header />

      <div className="min-h-screen bg-primary px-4 flex flex-col gap-10">
        {/* Hero Section */}
        <section className="bg-primary mt-14 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4">
                Contáctanos - Soluciones para Gimnasios
              </h1>
              <p className="text-quaternary text-base sm:text-lg 2xl:text-xl max-w-3xl mx-auto leading-relaxed">
                ¿Listo para digitalizar tu gimnasio? Nuestro equipo comercial está aquí para ayudarte a
                encontrar la solución perfecta para tu centro deportivo.
              </p>
            </div>

            {/* Contact Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {contactMethods.map((method, index) => (
                <WayToContactCard
                  key={index}
                  icon={method.icon}
                  title={method.title}
                  contacts={method.contacts}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="bg-primary py-8 ">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Form - Takes 2 columns on large screens */}
              <div className="lg:col-span-2">
                <ContactForInfoCard />
              </div>

              {/* Right Sidebar */}
              <div className="space-y-8">
                {/* FAQ */}
                <FrequentQuestionsCard />

                {/* Implementation Average */}
                <ImplementAverageCard />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}