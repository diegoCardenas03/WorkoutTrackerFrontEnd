import { useState } from "react"
import { LuChevronDown, LuSend } from "react-icons/lu"
import { Button } from "../../Button"

export const ContactForInfoCard = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        gymName: "",
        gymType: "",
        memberCount: "",
        helpType: "",
        message: ""
    })

    const gymTypes = [
        "Gimnasio tradicional",
        "Crossfit Box",
        "Estudio de yoga",
        "Centro deportivo",
        "Gimnasio boutique",
        "Otro"
    ]

    const memberRanges = [
        "1-50 miembros",
        "51-200 miembros",
        "201-500 miembros",
        "501-1000 miembros",
        "Más de 1000 miembros"
    ]

    const helpTypes = [
        "Demostración del producto",
        "Información de precios",
        "Migración de datos",
        "Capacitación del equipo",
        "Soporte técnico",
        "Consulta general"
    ]

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = () => {
        console.log("Enviar solicitud comercial:", formData)
        // Aquí iría la lógica para enviar el formulario
    }

    return (
        <div className="bg-tertiary rounded-xl p-6 sm:p-8 border border-white/10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <LuSend className="text-white" size={24} />
                <h2 className="text-white text-xl sm:text-2xl font-semibold">
                    Solicita información para tu gimnasio
                </h2>
            </div>

            {/* Form */}
            <div className="space-y-6">
                {/* Información Personal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <label className="text-white text-sm font-medium block mb-2">
                            Nombre completo
                        </label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            placeholder="Tu nombre completo"
                            className="w-full p-3 border border-white/80 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40"
                        />
                    </div>

                    <div>
                        <label className="text-white text-sm font-medium block mb-2">
                            Email corporativo
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="tu@tugimnasio.com"
                            className="w-full p-3 border border-white/80 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-white text-sm font-medium block mb-2">
                        Teléfono de contacto
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+54 (261) 2539532"
                        className="w-full p-3 border border-white/80 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40"
                    />
                </div>

                {/* Información del Gimnasio */}
                <div className="pt-4 border-t border-white/10">
                    <h3 className="text-white text-lg font-semibold mb-4">
                        Información del Gimnasio
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-white text-sm font-medium block mb-2">
                                Nombre del gimnasio
                            </label>
                            <input
                                type="text"
                                value={formData.gymName}
                                onChange={(e) => handleInputChange("gymName", e.target.value)}
                                placeholder="Nombre de tu gimnasio o cadena"
                                className="w-full p-3 border border-white/80 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="text-white text-sm font-medium block mb-2">
                                    Tipo de gimnasio
                                </label>
                                <select
                                    value={formData.gymType}
                                    onChange={(e) => handleInputChange("gymType", e.target.value)}
                                    className="w-full p-3 pr-10 border border-white/80 rounded-lg text-white focus:outline-none focus:border-white/40 appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-primary">Selecciona el tipo</option>
                                    {gymTypes.map((type) => (
                                        <option key={type} value={type} className="bg-primary">
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <LuChevronDown
                                    className="absolute right-3 top-[2.7rem] text-quaternary pointer-events-none"
                                    size={20}
                                />
                            </div>

                            <div className="relative">
                                <label className="text-white text-sm font-medium block mb-2">
                                    Número de miembros actuales
                                </label>
                                <select
                                    value={formData.memberCount}
                                    onChange={(e) => handleInputChange("memberCount", e.target.value)}
                                    className="w-full p-3 pr-10 border border-white/80  rounded-lg text-white focus:outline-none focus:border-white/40 appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-primary">Rango de miembros</option>
                                    {memberRanges.map((range) => (
                                        <option key={range} value={range} className="bg-primary">
                                            {range}
                                        </option>
                                    ))}
                                </select>
                                <LuChevronDown
                                    className="absolute right-3 top-[2.7rem] text-quaternary pointer-events-none"
                                    size={20}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-white text-sm font-medium block mb-2">
                                ¿En qué podemos ayudarte?
                            </label>
                            <select
                                value={formData.helpType}
                                onChange={(e) => handleInputChange("helpType", e.target.value)}
                                className="w-full p-3 pr-10 border border-white/80  rounded-lg text-white focus:outline-none focus:border-white/40 appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-primary">Selecciona el tipo de consulta</option>
                                {helpTypes.map((help) => (
                                    <option key={help} value={help} className="bg-primary">
                                        {help}
                                    </option>
                                ))}
                            </select>
                            <LuChevronDown
                                className="absolute right-3 top-[2.7rem] text-quaternary pointer-events-none"
                                size={20}
                            />
                        </div>

                        <div>
                            <label className="text-white text-sm font-medium block mb-2">
                                Mensaje adicional
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => handleInputChange("message", e.target.value)}
                                placeholder="Cuéntanos más sobre tus necesidades específicas, objetivos del gimnasio o cualquier pregunta particular..."
                                rows={4}
                                className="w-full p-3 border border-white/80 rounded-lg text-white placeholder-quaternary focus:outline-none focus:border-white/40 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <Button
                        icon={<LuSend size={16} />}
                        iconPosition={false}
                        isWhite={true}
                        action={handleSubmit}
                        isWidthFull={true}
                    >
                        Enviar solicitud comercial
                    </Button>
                </div>
            </div>
        </div>
    )
}