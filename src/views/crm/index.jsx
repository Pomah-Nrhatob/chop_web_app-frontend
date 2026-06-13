'use client'

import ContainerForPage from '@/components/containerForPage/ContainerForPage'
import ObjectReportGenerator from '@/widgets/report-generator/ui/ObjectReportGenerator'
import SecurityReportGenerator from '@/widgets/report-generator/ui/SecurityReportGenerator'
import { Box, SimpleGrid, Heading, Text, VStack, Icon, Center } from '@chakra-ui/react'
import Link from 'next/link'
import { useState } from 'react'
import { LuShieldCheck, LuBuilding2 } from 'react-icons/lu'
import { TbReport, TbReportAnalytics } from 'react-icons/tb'

export default function BcRootPage() {
  const [securityReportOpen, setSecurityReportOpen] = useState(false)
  const [objectReportOpen, setObjectReportOpen] = useState(false)

  const navigationCards = [
    {
      id: 1,
      title: 'Охрана',
      description: 'Управление персоналом.',
      href: '/bc/security',
      icon: LuShieldCheck,
      color: 'blue.500',
      type: 'link',
    },
    {
      id: 2,
      title: 'Объекты',
      description: 'Список охраняемых объектов.',
      href: '/bc/object',
      icon: LuBuilding2,
      color: 'teal.500',
      type: 'link',
    },
    {
      id: 3,
      title: 'Отчет сотрудников',
      description: 'Сформируйте отчет сотрудников.',
      href: null,
      icon: TbReport,
      color: 'blue.500',
      type: 'button',
      onClick: () => setSecurityReportOpen(true),
    },
    {
      id: 4,
      title: 'Отчет объектов',
      description: 'Сформируйте отчет объектов.',
      href: null,
      icon: TbReportAnalytics,
      color: 'teal.500',
      type: 'button',
      onClick: () => setObjectReportOpen(true),
    },
  ]

  return (
    <>
      <SecurityReportGenerator
        open={securityReportOpen}
        onOpenChange={setSecurityReportOpen}
        hideTrigger
      />
      <ObjectReportGenerator
        open={objectReportOpen}
        onOpenChange={setObjectReportOpen}
        hideTrigger
      />

      <ContainerForPage
        title="Быстрый доступ к разделам"
        text="Выберите раздел для работы с данными"
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
          {navigationCards.map((card) => {
            const content = (
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
                  >
                    <Icon as={card.icon} boxSize={8} color={card.color} />
                  </Center>

                  <Box>
                    <Heading size="md" mb={2}>
                      {card.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      {card.description}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            )

            return card.type === 'link' ? (
              <Link key={card.id} href={card.href} style={{ textDecoration: 'none' }}>
                {content}
              </Link>
            ) : (
              <Box key={card.id} onClick={card.onClick}>
                {content}
              </Box>
            )
          })}
        </SimpleGrid>
      </ContainerForPage>
    </>
  )
}
