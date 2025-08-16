interface WayToContactCardProps {
    icon: React.ReactNode
    title: string
    contacts: string[]
}

export const WayToContactCard = ({
    icon,
    title,
    contacts
}: WayToContactCardProps) => {
    return (
        <div className="bg-tertiary rounded-xl p-6 sm:p-8 border border-white/10 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
                <div className="">
                    {icon}
                </div>
            </div>

            {/* Title */}
            <h3 className="text-white text-lg sm:text-xl font-semibold mb-4">
                {title}
            </h3>

            {/* Contact Information */}
            <div className="space-y-2">
                {contacts.map((contact, index) => (
                    <p key={index} className="text-quaternary text-sm sm:text-base">
                        {contact}
                    </p>
                ))}
            </div>
        </div>
    )
}