'use client'

import { Box, SimpleGrid, Heading, Text, VStack, Icon, Center } from '@chakra-ui/react'
import Link from 'next/link'
import { LuShieldCheck, LuBuilding2 } from 'react-icons/lu'

export default function BcRootPage() {
  const navigationCards = [
    {
      title: 'Охрана',
      description: 'Управление персоналом.',
      href: '/bc/security',
      icon: LuShieldCheck,
      color: 'blue.500',
    },
    {
      title: 'Объекты',
      description: 'Список охраняемых объектов.',
      href: '/bc/object',
      icon: LuBuilding2,
      color: 'teal.500',
    },
  ]

  return (
    <Center minH="80vh" p={6}>
      <VStack gap={8} w="full" maxW="900px">
        <VStack gap={2} textAlign="center">
          <Heading size="2xl" letterSpacing="tight">
            Панель управления BC
          </Heading>
          <Text color="gray.500" fontSize="lg">
            Выберите раздел для работы с данными
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
          {navigationCards.map((card) => (
            <Link href={card.href} key={card.href} style={{ textDecoration: 'none' }}>
              <Box
                p={8}
                height="full"
                borderWidth="1px"
                borderRadius="2xl"
                transition="all 0.3s"
                cursor="pointer"
                bg="white"
                _hover={{
                  transform: 'translateY(-5px)',
                  shadow: 'xl',
                  borderColor: card.color,
                }}
                role="group"
              >
                <VStack align="start" gap={4}>
                  <Center
                    p={3}
                    bg="gray.50"
                    borderRadius="xl"
                    _groupHover={{ bg: `${card.color.split('.')[0]}.50` }}
                    transition="background 0.3s"
                  >
                    <Icon as={card.icon} boxSize={8} color={card.color} />
                  </Center>

                  <Box>
                    <Heading size="md" mb={2}>
                      {card.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm" lineHeight="tall">
                      {card.description}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      </VStack>
    </Center>
  )
}
