export const getTagStyles = (color: string) => {
    const styles = {
      green: 'bg-[#B6FFBA] text-[#215115] border-none',
      blue: 'bg-[#B6DBFF] text-[#195472] border-none ',
      yellow: 'bg-[#FFF1B6] text-[#726119] border-none',
      red: 'bg-[#D8AFAF] text-[#6C1818] border-none',
      orange: 'bg-[#FFD8B6] text-[#724819] border-none '
    }
    return styles[color as keyof typeof styles] || styles.blue
  }