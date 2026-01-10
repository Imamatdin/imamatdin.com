import { useState, useEffect } from 'react';
import { Box, Text, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

const LOGO_TEXT = 'iko';
const TYPING_SPEED = 150; // ms per character
const CURSOR_BLINK_COUNT = 3;
const CURSOR_BLINK_SPEED = 400; // ms per blink

export function AnimatedLogo() {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if animation was already played this session
    const hasAnimated = sessionStorage.getItem('logo-animated');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasAnimated || prefersReducedMotion) {
      // Skip animation, show full text
      setDisplayedText(LOGO_TEXT);
      setShowCursor(false);
      setIsAnimationComplete(true);
    } else {
      setShouldAnimate(true);
      sessionStorage.setItem('logo-animated', 'true');
    }
  }, []);

  // Typing animation
  useEffect(() => {
    if (!shouldAnimate) return;

    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < LOGO_TEXT.length) {
        setDisplayedText(LOGO_TEXT.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        // Start cursor blinking after typing complete
        let blinkCount = 0;
        const blinkInterval = setInterval(() => {
          setShowCursor(prev => !prev);
          blinkCount++;
          if (blinkCount >= CURSOR_BLINK_COUNT * 2) {
            clearInterval(blinkInterval);
            setShowCursor(false);
            setIsAnimationComplete(true);
          }
        }, CURSOR_BLINK_SPEED);
      }
    }, TYPING_SPEED);

    return () => clearInterval(typeInterval);
  }, [shouldAnimate]);

  return (
    <NextLink href="/" passHref>
      <HStack
        spacing={0}
        cursor="pointer"
        role="link"
        aria-label="Go to homepage"
        _hover={{
          '& .logo-text': {
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
          }
        }}
      >
        {/* Optional: Small icon before text */}
        <Box
          as="span"
          fontSize="14px"
          mr={1}
          opacity={0.7}
        >
          {'›'}
        </Box>

        <Text
          className="logo-text"
          fontFamily="mono"
          fontWeight="bold"
          fontSize="14px"
          letterSpacing="-0.02em"
        >
          {displayedText}
        </Text>

        {/* Blinking cursor */}
        {showCursor && (
          <Box
            as="span"
            fontFamily="mono"
            fontWeight="bold"
            fontSize="14px"
            ml="1px"
            animation={isAnimationComplete ? undefined : 'none'}
          >
            _
          </Box>
        )}
      </HStack>
    </NextLink>
  );
}
