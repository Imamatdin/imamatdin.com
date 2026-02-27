import { Box, Text, VStack, useColorModeValue } from '@chakra-ui/react';

export default function Home() {
  const textColor = useColorModeValue('#1a1a1a', '#e0e0e0');
  const subtleColor = useColorModeValue('#666666', '#999999');

  return (
    <VStack align="flex-start" spacing={2} width="100%" fontFamily="mono" fontSize="14px">
      <Text color={textColor} lineHeight="1.8">
        Gap year. Building.
      </Text>

      <Box>
        <Text fontWeight="bold" mb={1} color={textColor}>Currently:</Text>
        <Box as="ul" pl={4} listStyleType="disc">
          <Text as="li" mb={1} color={textColor} lineHeight="1.8">
            SENTINEL - autonomous AI pentesting platform, red team vs blue team agents on
            Cerebras inference. Shipping this month.
          </Text>
          <Text as="li" mb={1} color={textColor} lineHeight="1.8">
            Aral Basin Environmental Platform - first deep learning pipeline for the Aral Sea
            disaster zone. 50+ years of satellite data nobody has processed with modern ML.
          </Text>
          <Text as="li" mb={1} color={textColor} lineHeight="1.8">
            Expanding datacenter cooling research - RL agents that achieved 94.4% water savings.
            Now applying Decision Transformers and world models to a 1.2B observation dataset.
          </Text>
          <Text as="li" mb={1} color={textColor} lineHeight="1.8">
            Agentic OS - custom Linux environment (Arch + Hyprland) with integrated AI tooling.
            Building toward a fully autonomous engineering workstation.
          </Text>
          <Text as="li" color={textColor} lineHeight="1.8">
            Freelance AI/automation systems through a Canadian partnership.
          </Text>
        </Box>
      </Box>

      <Text color={subtleColor} lineHeight="1.8">
        Previously: TKS, Nexus AI Fellowship, LaunchX. 1500 SAT. 40+ taekwondo medals.
      </Text>

      <Text color={textColor} lineHeight="1.8">
        Applying to study mechanical engineering.
      </Text>

      <Text color={textColor} lineHeight="1.8">
        I'm looking for compute sponsorship and research funding to scale my environmental
        and security AI projects. If you want to support this work, reach out.
      </Text>
    </VStack>
  );
}
