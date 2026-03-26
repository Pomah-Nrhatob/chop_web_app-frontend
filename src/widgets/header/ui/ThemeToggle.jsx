import { useColorMode } from '@/providers/chakraProvider/color-mode'
import { IconButton } from '@chakra-ui/react'
import { HiSun, HiMoon } from 'react-icons/hi2'

export const ThemeToggle = () => {
  const { toggleColorMode, colorMode } = useColorMode()
  return (
    <IconButton aria-label="Переключить тему" onClick={toggleColorMode} variant="outline" size="sm">
      {colorMode === 'dark' ? <HiMoon /> : <HiSun />}
    </IconButton>
  )
}
