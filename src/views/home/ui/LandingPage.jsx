// src/views/landing/LandingPage.jsx
'use client'

import { Box, VStack } from '@chakra-ui/react'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import HowItWorksSection from './HowItWorksSection'
import StatsSection from './StatsSection'
import CTASection from './CTASection'
import LandingFooter from './LandingFooter'

export default function LandingPage() {
  return (
    <Box bg="gray.50" minH="100vh">
      <VStack align="stretch" spacing={0}>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <CTASection />
        <LandingFooter />
      </VStack>
    </Box>
  )
}
