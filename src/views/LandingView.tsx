import { LuArrowRight, LuChartColumn, LuCheck, LuCirclePlay, LuShield, LuUsers, LuZap } from "react-icons/lu"
import { Button } from "../components/Button"
import { Header } from "../components/PublicHeader"
import { Footer } from "../components/Footer"
import { useAuth0 } from "@auth0/auth0-react"
import { useNavigate } from "react-router-dom"

export const LandingView = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <section className="w-full flex flex-col items-center justify-center">

        {/* Seccion Principal, Banner, Botones y Stats */}

        <section className="w-full flex flex-col items-center justify-center py-5 gap-7 px-5 md:px-10 lg:px-10">
          <div className="flex flex-col md:w-[90%] lg:w-[80%] xl:w-[70%] 2xl:w-[55%] gap-2">
            <h1 className="text-white font-extrabold lg:text-[3em] md:text-[2.5em] 
            sm:text-[2.2em] text-[1.7em] text-center">La plataforma que tu gimnasio necesita para crecer
            </h1>
            <p className=" text-quaternary text-[15px] md:text-[1.2em] lg:text-[1.2em] xl:text-[1.2em] 2xl:text-[1.2em] text-center">Aumenta la retención de miembros, optimiza tus operaciones y ofrece una experiencia digital única con WKTracker - la solución SaaS diseñada específicamente para gimnasios modernos.</p>
          </div>

          <div className="w-full flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row flex justify-center items-center gap-6">
            {isAuthenticated ? (
              <Button icon={<LuArrowRight />} action={() => navigate('/')}> Ir al Dashboard </Button>
            ) : (
              <>
                <Button icon={<LuArrowRight />}> Comenzar Demo Gratis </Button>
                <Button isWhite={false} icon={<LuCirclePlay />} iconPosition={false}> Ver Video Demo </Button>
              </>
            )}
          </div>

          <div className="w-full grid grid-flow-col grid-rows-2 md:flex lg:flex xl:flex 2xl:flex justify-center items-center gap-12 py-8">
            <div>
              <h2 className="text-white font-semibold text-center text-[1.5em] md:text-[1.8em] lg:text-[1.8em] xl:text-[1.8em] 2xl:text-[1.8em]">200+</h2>
              <p className="text-quaternary text-center">Gimnasios activos</p>
            </div>
            <div>
              <h2 className="text-white font-semibold  text-center text-[1.5em] md:text-[1.8em] lg:text-[1.8em] xl:text-[1.8em] 2xl:text-[1.8em]">50.000+</h2>
              <p className="text-quaternary text-center">Miembros gestionados</p>
            </div>
            <div>
              <h2 className="text-white font-semibold  text-center text-[1.5em] md:text-[1.8em] lg:text-[1.8em] xl:text-[1.8em] 2xl:text-[1.8em]">40%</h2>
              <p className="text-quaternary text-center">Aumento en retención</p>
            </div>
            <div>
              <h2 className="text-white font-semibold text-center text-[1.5em] md:text-[1.8em] lg:text-[1.8em] xl:text-[1.8em] 2xl:text-[1.8em]">48h</h2>
              <p className="text-quaternary text-center">Tiempo de implementación</p>
            </div>
          </div>

        </section>


        {/* Sección "Todo lo que tu gimnasio necesita"  */}
        <section className="bg-secondary w-full flex flex-col justify-center items-center px-5 md:px-10 lg:px-10">
          <div className="flex flex-col justify-center items-center md:w-[70%] lg:w-[80%] xl:w-[55%] 2xl:w-[55%] gap-2 pt-[8em] pb-[4em]">
            <h1 className="text-white font-extrabold 2xl:text-[2.5em] lg:text-[2em] md:text-[1.5em] 
            text-[1.5em] text-center">Todo lo que tu gimnasio necesita
            </h1>
            <p className="text-quaternary text-[0.9em] md:text-[1.2em] lg:text-[1.2em] text-center">Una plataforma integral que combina gestión empresarial con tecnología de fitness de vanguardia</p>
          </div>

          <div className="w-full h-fit py-6 pb-[8em] lg:grid lg:grid-flow-col lg:grid-rows-2 lg:gap-10 grid grid-flow-row gap-5 items-center justify-between">
            {/* Tarjetas */}
            <div className="md:w-[30em] lg:w-[38em] lg:h-[12em] 2xl:w-[50em] w-full bg-tertiary flex flex-col rounded-lg shadow-2xl px-6 py-5 gap-8">
              <div className="w-full flex gap-4 items-center">
                <div className="bg-white/10 w-[2.5em] h-[2.5em] flex justify-center items-center rounded-lg"> <LuUsers color="white" fontSize={"1.3em"} /> </div>
                <h2 className="text-white font-semibold text-[1em] lg:text-[1.3em]">Gestión de miembros</h2>
              </div>
              <p className="text-quaternary text-[12px] md:text-[14px] lg:text-[14px] 2xl:text-[18px]">Administra todos tus miembros desde un panel centralizado con perfiles detallados y seguimiento personalizado.</p>
            </div>

            <div className="md:w-[30em] lg:w-[38em] lg:h-[12em] 2xl:w-[50em] w-full bg-tertiary flex flex-col rounded-lg shadow-2xl px-6 py-5 gap-8">
              <div className="w-full flex gap-4 items-center">
                <div className="bg-white/10 w-[2.5em] h-[2.5em] flex justify-center items-center rounded-lg"> <LuShield color="white" fontSize={"1.3em"} /> </div>
                <h2 className="text-white font-semibold text-[1em] lg:text-[1.3em]">App Personalizada</h2>
              </div>
              <p className="text-quaternary text-[12px] md:text-[14px] lg:text-[14px] 2xl:text-[18px]">Cada gimnasio obtiene su propia versión de la app con su marca, colores y logo corporativo.</p>
            </div>

            <div className="md:w-[30em] lg:w-[38em] lg:h-[12em] 2xl:w-[50em] w-full bg-tertiary flex flex-col rounded-lg shadow-2xl px-6 py-5 gap-8">
              <div className="w-full flex gap-4 items-center">
                <div className="bg-white/10 w-[2.5em] h-[2.5em] flex justify-center items-center rounded-lg"> <LuChartColumn color="white" fontSize={"1.3em"} /> </div>
                <h2 className="text-white font-semibold text-[1em] lg:text-[1.3em]">Analytics Avanzados</h2>
              </div>
              <p className="text-quaternary text-[12px] md:text-[14px] lg:text-[14px] 2xl:text-[18px]">Obtén insights profundos sobre el uso, progreso y retención de tus miembros con reportes en tiempo real.</p>
            </div>

            <div className="md:w-[30em] lg:w-[38em] lg:h-[12em] 2xl:w-[50em] w-full] bg-tertiary flex flex-col rounded-lg shadow-2xl px-6 py-5 gap-8">
              <div className="w-full flex gap-4 items-center">
                <div className="bg-white/10 w-[2.5em] h-[2.5em] flex justify-center items-center rounded-lg"> <LuZap color="white" fontSize={"1.3em"} /> </div>
                <h2 className="text-white font-semibold text-[1em] lg:text-[1.3em]">Implementación Rápida
                </h2>
              </div>
              <p className="text-quaternary text-[12px] md:text-[14px] lg:text-[14px] 2xl:text-[18px]">Configura tu gimnasio en menos de 48 horas con migración de datos y capacitación incluida.</p>
            </div>
          </div>

        </section>

        {/* Sección "Planes para cada tipo de gimnasio"  */}
        <section className="bg-secondary w-full flex flex-col justify-center items-center px-5 md:px-10 lg:px-10 pb-10">

          <div className="flex flex-col justify-center items-center md:w-[70%] lg:w-[80%] xl:w-[55%] 2xl:w-[55%] gap-2 pb-[4em]">
            <h1 className="text-white font-extrabold 2xl:text-[2.5em] lg:text-[2em] md:text-[1.5em] 
            text-[1.5em] text-center">Planes para cada tipo de gimnasio
            </h1>
            <p className="text-quaternary text-[0.9em] md:text-[1.2em] lg:text-[1.2em] text-center">Elige el plan que mejor se adapte a las necesidades de tu negocio</p>
          </div>

          <div className="w-full flex lg:flex-row flex-col gap-5 items-center justify-between">
            {/* Tarjetas de precios */}
            <div className="bg-tertiary w-full md:w-[25em] lg:w-[25em] lg:h-[35em] pb-[2em] flex flex-col items-center justify-center rounded-lg shadow-2xl px-8 lg:pt-0 md:pt-0 pt-3">
              <div className="w-full flex flex-col items-center gap-2 pt-4">
                <h2 className="text-white font-normal md:font-semibold lg:font-semibold text-[1.5em]  md:text-[1.5em] lg:text-[1.5em]">Starter</h2>
                <h1 className="text-white font-bold text-[1.6em] md:lg:text-[2em] lg:text-[2em]" >$30.000<span className="text-quaternary font-normal text-[0.65em]">/mes</span></h1>
                <p className="text-quaternary text-[0.9em] lg:text-[1em] md:text-[1em]">Perfecto para gimnasios pequeños</p>
              </div>
              <ul className="w-full flex flex-col pt-10 pb-30 h-[16em] md:h-[20em] lg:h-[20em] gap-2">
                <li className="flex items-center text-white text-[15px] font-light gap-2.5"><LuCheck color="green" /> Hasta 200 miembros</li>
                <li className="flex items-center text-white text-[15px] font-light gap-2.5 "><LuCheck color="green" /> App personalizada básica</li>
                <li className="flex items-center text-white text-[15px] font-light gap-2.5"><LuCheck color="green" /> Panel de administración</li>
                <li className="flex items-center text-white text-[15px] font-light gap-2.5"><LuCheck color="green" /> Soporte por email</li>
                <li className="flex items-center text-white text-[15px] font-light gap-2.5"><LuCheck color="green" /> Analytics básicos</li>
              </ul>

              <Button isWhite={false} isWidthFull={true} isBlocked={isAuthenticated}>Comenzar prueba</Button>
            </div>

            <div className="bg-tertiary w-full md:w-[25em] lg:w-[25em] lg:h-[35em] pb-[2em] flex flex-col items-center justify-center rounded-lg shadow-2xl px-8 lg:pt-0 md:pt-0 pt-3">
              <div className="w-full flex flex-col items-center gap-2 pt-4">
                <h2 className="text-white font-normal md:font-semibold lg:font-semibold text-[1.5em]  md:text-[1.5em] lg:text-[1.5em]">Profesional</h2>
                <h1 className="text-white font-bold text-[1.6em] md:lg:text-[2em] lg:text-[2em]" >$70.000<span className="text-quaternary font-normal text-[0.65em]">/mes</span></h1>
                <p className="text-quaternary text-[0.9em] lg:text-[1em] md:text-[1em]">Para cadenas de gimnasios</p>
              </div>
              <ul className="w-full flex flex-col pt-10 pb-30 h-[16em] md:h-[20em] lg:h-[20em] gap-2">
                <li className="flex items-center text-white text-[15px] font-light gap-2.5"><LuCheck color="green" /> Hasta 1000 miembros</li>
                <li className="flex items-center text-white text-[15px] font-light gap-2.5 "><LuCheck color="green" /> App completamente personalizada</li>
                <li className="flex items-center text-white text-[15px] font-light gap-2.5"><LuCheck color="green" /> Analytics avanzados</li>
                <li className="flex items-center text-white text-[15px] font-light gap-2.5"><LuCheck color="green" /> Soporte prioritario 24/7</li>
                <li className="flex items-center text-white text-[15px] font-light gap-2.5"><LuCheck color="green" /> Integraciones incluidas</li>
                <li className="flex items-center text-white text-[15px] font-light gap-2.5"><LuCheck color="green" /> Multi-ubicación</li>
              </ul>

              <Button isWidthFull={true} isBlocked={isAuthenticated}>Comenzar prueba</Button>
            </div>

            <div className="bg-tertiary w-full md:w-[25em] lg:w-[25em] lg:h-[35em] pb-[2em] flex flex-col items-center justify-center rounded-lg shadow-2xl px-8 lg:pt-0 md:pt-0 pt-3">
              <div className="w-full flex flex-col items-center gap-2 pt-4">
                <h2 className="text-white font-normal md:font-semibold lg:font-semibold text-[1.5em]  md:text-[1.5em] lg:text-[1.5em]">Enterprise</h2>
                <h1 className="text-white font-bold text-[1.6em] md:lg:text-[2em] lg:text-[2em]" >Personalizado</h1>
                <p className="text-quaternary text-[0.9em] lg:text-[1em] md:text-[1em]">Para cadenas de gimnasios</p>
              </div>
              <ul className="w-full flex flex-col pt-10 pb-30 h-[16em] md:h-[20em] lg:h-[20em] gap-2">
                <li className="flex items-center text-white text-[15px] font-light gap-2.5"><LuCheck color="green" /> Miembros ilimitados</li>
                <li className="flex items-center text-white text-[15px] font-light gap-2.5 "><LuCheck color="green" /> Desarollo personalizado</li>
                <li className="flex items-center text-white text-[15px] font-light gap-2.5"><LuCheck color="green" /> Gerente de cuenta dedicado</li>
                <li className="flex items-center text-white text-[15px] font-light gap-2.5"><LuCheck color="green" /> SLA garantizado</li>
                <li className="flex items-center text-white text-[15px] font-light gap-2.5"><LuCheck color="green" /> Integración completa</li>
                <li className="flex items-center text-white text-[15px] font-light gap-2.5"><LuCheck color="green" /> Capacitación presencial</li>
              </ul>

              <Button isWhite={false} isWidthFull={true} isBlocked={isAuthenticated}>Contactar Ventas</Button>
            </div>
          </div>

        </section>

        {/* Sección "Listo para transformar tu gimnasio"  */}

        <section className="bg-primary w-full flex flex-col justify-center items-center px-5 md:px-10 lg:px-10 pb-20">
          <div className="flex flex-col justify-center items-center md:w-[70%] lg:w-[80%] xl:w-[55%] 2xl:w-[55%] gap-2 pt-[6em] pb-[1em]">
            <h1 className="text-white font-extrabold 2xl:text-[2.5em] lg:text-[2em] md:text-[1.5em] 
            text-[1.5em] text-center">¿Listo para transformar tu gimnasio?
            </h1>
            <p className="text-quaternary text-[0.9em] md:text-[1.2em] lg:text-[1.2em] w-[90%] lg:w-full md:w-full text-center">Únete a más de 200 gimnasios que ya mejoraron su retención y optimizaron sus operaciones con WorkoutTracker.</p>
          </div>
          
          <div className="w-full flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row flex justify-center items-center gap-6">
            {isAuthenticated ? (
              <Button icon={<LuArrowRight />} action={() => navigate('/')}> Ir al Dashboard </Button>
            ) : (
              <>
                <Button icon={<LuArrowRight />} > Solicitar Demo Personalizada </Button>
                <Button isWhite={false}> Acceder a la Plataforma </Button>
              </>
            )}
          </div>

          <div className="flex text-[13px] items-center justify-center gap-1 pt-3">
            <p className="text-quaternary text-center">🔒 Sin compromiso • Implementación en 48h • Soporte especializado</p> 
            
          </div>
        </section>
      </section>
      <Footer />
    </>
  )
}
