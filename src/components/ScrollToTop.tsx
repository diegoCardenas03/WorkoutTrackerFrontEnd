import { useLayoutEffect } from "react"
import { useLocation } from "react-router-dom"

export const ScrollToTop = () => {
  const { pathname } = useLocation()

  // useLayoutEffect se ejecuta ANTES del repaint, evitando el destello
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}