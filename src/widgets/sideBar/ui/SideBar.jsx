// src/components/ui/SidebarNav.tsx
'use client'

import {
  Box,
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerPositioner,
  IconButton,
  VStack,
  Button,
  useBreakpointValue,
  Portal,
  Flex,
  Text,
  Icon,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'
import { navItems } from '@/widgets/sideBar/data/navItems'
import { useClickOutside } from '@/shared/hooks/useClickOutside'
import Link from 'next/link'

const HEADER_HEIGHT = '79px'
const SIDEBAR_WIDTH = '280px'
const COLLAPSED_WIDTH = '80px'

export function SidebarNav({ onToggle, collapsedWidth = COLLAPSED_WIDTH }) {
  const router = useRouter()
  const isMobile = useBreakpointValue({ base: true, md: false })

  // Состояния
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = useState(true)
  const desktopSidebarRef = useRef(null)

  // Уведомляем родителя
  useEffect(() => {
    onToggle?.(isMobile ? mobileOpen : true, desktopCollapsed)
  }, [mobileOpen, desktopCollapsed, isMobile, onToggle])

  // Закрытие при клике вне на десктопе
  useClickOutside(
    desktopSidebarRef,
    () => {
      if (!isMobile && !desktopCollapsed) {
        setDesktopCollapsed(true)
      }
    },
    !isMobile && !desktopCollapsed
  )

  const handleNavigate = (href) => {
    router.push(href)
    if (isMobile) {
      setMobileOpen(false)
    } else {
      setDesktopCollapsed(true)
    }
  }

  const ToggleButton = () => (
    <IconButton
      aria-label={isMobile ? 'Открыть меню' : 'Открыть/закрыть панель'}
      color="blue"
      background="gray.300"
      onClick={
        isMobile ? () => setMobileOpen(!mobileOpen) : () => setDesktopCollapsed(!desktopCollapsed)
      }
      position="fixed"
      top={`calc(${HEADER_HEIGHT} + 16px)`}
      left={isMobile ? '16px' : desktopCollapsed ? '8px' : `calc(${SIDEBAR_WIDTH} - 20px)`}
      zIndex={1200}
      size={isMobile ? 'sx' : 'sm'}
      borderRadius="full"
      boxShadow="md"
      transition="left 0.2s ease, color 0.2s ease"
      variant="surface"
    >
      {isMobile ? (
        mobileOpen ? (
          <FiChevronLeft size={20} />
        ) : (
          <FiChevronRight size={20} />
        )
      ) : desktopCollapsed ? (
        <FiChevronRight size={16} />
      ) : (
        <FiChevronLeft size={16} />
      )}
    </IconButton>
  )

  const NavigationContent = () => (
    <VStack align="stretch" gap={1} px={desktopCollapsed && !isMobile ? 2 : 4}>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            // key={item.href}
            variant="ghost"
            justifyContent={desktopCollapsed && !isMobile ? 'center' : 'flex-start'}
            size="md"
            // onClick={() => handleNavigate(item.href)}
            whiteSpace="nowrap"
            overflow="hidden"
            title={desktopCollapsed && !isMobile ? item.label : undefined}
          >
            <Icon color="gray.500">{item.icon}</Icon>
            {(!desktopCollapsed || isMobile) && (
              <Text style={{ marginLeft: '8px' }}>{item.label}</Text>
            )}
          </Button>
        </Link>
      ))}
    </VStack>
  )

  return (
    <>
      <ToggleButton />

      {/* Мобильная версия — Drawer слева */}
      {isMobile && (
        <Portal>
          <Drawer.Root
            open={mobileOpen}
            onOpenChange={(details) => setMobileOpen(details.open)}
            placement="start"
          >
            <DrawerBackdrop />
            <DrawerPositioner>
              <DrawerContent w={SIDEBAR_WIDTH} maxW={SIDEBAR_WIDTH}>
                <DrawerBody p={0}>
                  <Flex
                    direction="column"
                    h={`calc(100vh - ${HEADER_HEIGHT})`}
                    pt={16}
                    pb={6}
                    bg="white"
                  >
                    <NavigationContent />
                  </Flex>
                </DrawerBody>
              </DrawerContent>
            </DrawerPositioner>
          </Drawer.Root>
        </Portal>
      )}

      {/* Десктопная версия — фиксированная sidebar */}
      {!isMobile && (
        <Box
          ref={desktopSidebarRef}
          as="aside"
          position="fixed"
          top={HEADER_HEIGHT}
          left={0}
          w={desktopCollapsed ? collapsedWidth : SIDEBAR_WIDTH}
          h={`calc(100vh - ${HEADER_HEIGHT})`}
          bg="white"
          borderRightWidth="1px"
          borderRightColor="gray.200"
          zIndex={1000}
          transition="width 0.2s ease"
          overflow="hidden"
        >
          <Flex direction="column" h="100%" pt={16} pb={6}>
            <NavigationContent />
          </Flex>
        </Box>
      )}
    </>
  )
}
