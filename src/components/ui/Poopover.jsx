import { Box, Popover as ChakraPopover, Portal } from '@chakra-ui/react'
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'

export const Popover = forwardRef(function Popover(
  {
    children,
    content,
    portalled = true,
    portalRef,
    contentProps = {},
    openDelay = 150,
    closeDelay = 100,
    ...rest
  },
  ref
) {
  const [open, setOpen] = useState(false)

  const canHover = useMemo(() => {
    if (typeof window === 'undefined') return false

    return window.matchMedia('(hover: hover)').matches
  }, [])

  const openTimeout = useRef()
  const closeTimeout = useRef()
  const autoCloseTimeout = useRef()

  const handleMouseEnter = () => {
    if (!canHover) return

    clearTimeout(closeTimeout.current)

    openTimeout.current = setTimeout(() => {
      setOpen(true)
    }, openDelay)
  }

  const handleMouseLeave = () => {
    if (!canHover) return

    clearTimeout(openTimeout.current)

    closeTimeout.current = setTimeout(() => {
      setOpen(false)
    }, closeDelay)
  }

  const handleClick = () => {
    if (canHover) return

    setOpen(true)

    clearTimeout(autoCloseTimeout.current)

    autoCloseTimeout.current = setTimeout(() => {
      setOpen(false)
    }, 2000)
  }

  useEffect(() => {
    return () => {
      clearTimeout(openTimeout.current)
      clearTimeout(closeTimeout.current)
      clearTimeout(autoCloseTimeout.current)
    }
  }, [])

  return (
    <ChakraPopover.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      positioning={{
        placement: 'top',
        gutter: 8,
      }}
      {...rest}
    >
      <ChakraPopover.Trigger asChild>
        <Box
          display="inline-block"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {children}
        </Box>
      </ChakraPopover.Trigger>

      <Portal disabled={!portalled} container={portalRef}>
        <ChakraPopover.Positioner>
          <ChakraPopover.Content
            ref={ref}
            maxW={{ base: '180px', md: '220px' }}
            w="fit-content"
            p={3}
            borderRadius="md"
            boxShadow="lg"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...contentProps}
          >
            {content}
          </ChakraPopover.Content>
        </ChakraPopover.Positioner>
      </Portal>
    </ChakraPopover.Root>
  )
})
