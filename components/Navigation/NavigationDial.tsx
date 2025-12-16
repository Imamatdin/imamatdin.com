import { useState } from 'react';
import {
  Box,
  Circle,
  Text,
  useColorModeValue,
  keyframes,
} from '@chakra-ui/react';
import NextLink from 'next/link';

const navItems = [
  { label: 'Deep Dives', href: '/deep-dives', short: 'DD' },
  { label: 'Projects', href: '/projects', short: 'Pr' },
  { label: 'Library', href: '/reading', short: 'Li' },
  { label: 'Writing', href: '/writing', short: 'Wr' },
  { label: 'Stack', href: '/about/stack', short: 'St' },
];

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export function NavigationDial() {
  const [isOpen, setIsOpen] = useState(false);

  const inkColor = useColorModeValue('#3a2a1a', '#e8dfd0');
  const inkLight = useColorModeValue('#6b5c4a', '#a89060');
  const bgColor = useColorModeValue('#e8dfd0', '#2a1a0a');
  const hoverBg = useColorModeValue('#f5f0e8', '#1a1612');
  const borderColor = useColorModeValue('rgba(139, 90, 43, 0.3)', 'rgba(168, 144, 96, 0.3)');

  return (
    <Box
      position="fixed"
      bottom={8}
      right={8}
      zIndex={100}
    >
      {/* Expanding menu items */}
      {isOpen && navItems.map((item, i) => {
        // Calculate position in a circle
        const angle = (i * 360) / navItems.length - 90; // Start from top
        const radius = 70;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <NextLink href={item.href} key={item.href}>
            <Circle
              size="45px"
              bg={bgColor}
              border="1px solid"
              borderColor={borderColor}
              position="absolute"
              bottom={`calc(25px + ${y}px)`}
              right={`calc(25px - ${x}px)`}
              transform="translate(50%, 50%)"
              animation={`${fadeIn} 0.2s ease ${i * 0.05}s both`}
              cursor="pointer"
              transition="background 0.2s"
              _hover={{ bg: hoverBg }}
              title={item.label}
            >
              <Text
                fontFamily="handwriting"
                fontSize="xs"
                color={inkLight}
                _hover={{ color: inkColor }}
              >
                {item.short}
              </Text>
            </Circle>
          </NextLink>
        );
      })}

      {/* Center button */}
      <Circle
        size="50px"
        bg={bgColor}
        border="2px solid"
        borderColor={inkLight}
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        transition="all 0.2s"
        _hover={{
          bg: hoverBg,
          borderColor: inkColor,
        }}
        transform={isOpen ? 'rotate(45deg)' : 'none'}
      >
        <Text
          fontFamily="handwriting"
          fontSize="xl"
          color={inkColor}
        >
          +
        </Text>
      </Circle>
    </Box>
  );
}

export default NavigationDial;
