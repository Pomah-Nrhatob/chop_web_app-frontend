'use client'

import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import { Box, Button, Container, Flex, Link, Text } from '@chakra-ui/react'

const STORAGE_KEY = 'uchop_cookie_consent'
const COOKIE_VERSION = 1

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      setVisible(true)
      return
    }

    try {
      const consent = JSON.parse(stored)

      if (consent.version !== COOKIE_VERSION || !consent.accepted) {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        accepted: true,
        version: COOKIE_VERSION,
        date: Date.now(),
      })
    )

    setVisible(false)
  }

  if (!visible) {
    return null
  }

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex={1000}
      bg="gray.900"
      color="white"
      borderTopWidth="1px"
      borderColor="whiteAlpha.200"
    >
      <Container maxW="7xl" py={3}>
        <Flex
          gap={4}
          align="center"
          justify="space-between"
          direction={{
            base: 'column',
            md: 'row',
          }}
        >
          <Text fontSize="sm" color="gray.300">
            Мы используем Cookie для корректной работы сайта. Продолжая пользоваться Uchop, вы
            соглашаетесь с{' '}
            <Link asChild color="white" textDecoration="underline">
              <NextLink href="/cookie-policy">Политикой Cookie</NextLink>
            </Link>
            .
          </Text>

          <Button size="sm" colorPalette="blue" onClick={accept} flexShrink={0}>
            Понятно
          </Button>
        </Flex>
      </Container>
    </Box>
  )
}
