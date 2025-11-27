"use client";

import { ReactNode } from "react";
import {
  DrawerRoot,
  DrawerBackdrop,
  DrawerPositioner,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerCloseTrigger,
  Box,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { X } from "lucide-react";

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  ariaLabel?: string;
};

const sizeMap = {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  full: "full",
} as const;

const placementMap = {
  left: "start",
  right: "end",
  top: "top",
  bottom: "bottom",
} as const;

export default function Sheet({
  open,
  onOpenChange,
  children,
  side = "right",
  size = "md",
  ariaLabel,
}: SheetProps) {
  return (
    <DrawerRoot
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      placement={placementMap[side]}
      size={sizeMap[size]}
    >
      <DrawerBackdrop />
      <DrawerPositioner>
        <DrawerContent>
          <Box position="relative" h="100%" display="flex" flexDirection="column" bg="white" className="dark:bg-gray-900">
            <Box
              position="absolute"
              insetX={0}
              top={0}
              h={1}
              bg="brand.500"
            />
            <DrawerCloseTrigger asChild>
              <IconButton
                position="absolute"
                right={4}
                top={4}
                zIndex={10}
                size="sm"
                variant="outline"
                borderRadius="2xl"
                borderWidth="1px"
                borderColor="gray.200"
                className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-brand-500/50"
                bg="white"
                color="gray.500"
                _hover={{ borderColor: "brand.500", color: "brand.500" }}
                shadow="sm"
                aria-label="Sheet schließen"
              >
                <X size={20} />
              </IconButton>
            </DrawerCloseTrigger>
            <Box flex={1} overflow="hidden">
              {children}
            </Box>
          </Box>
        </DrawerContent>
      </DrawerPositioner>
    </DrawerRoot>
  );
}

type SheetContentProps = {
  children: ReactNode;
  className?: string;
};

export function SheetContent({ children, className = "" }: SheetContentProps) {
  return (
    <DrawerBody flex={1} overflowY="auto" px={6} py={6} className={className}>
      <Box mx="auto" w="100%" maxW="4xl">
        <Flex direction="column" gap={6}>
          {children}
        </Flex>
      </Box>
    </DrawerBody>
  );
}

type SheetHeaderProps = {
  children: ReactNode;
  className?: string;
  sticky?: boolean;
};

export function SheetHeader({
  children,
  className = "",
  sticky = true,
}: SheetHeaderProps) {
  return (
    <DrawerHeader
      flexShrink={0}
      borderBottomWidth="1px"
      borderColor="gray.200"
      className={`dark:border-gray-700 dark:bg-gray-800 ${className}`}
      bg="white"
      px={6}
      py={5}
      position={sticky ? "sticky" : "relative"}
      top={0}
      zIndex={10}
    >
      <Box mx="auto" w="100%" maxW="4xl">
        {children}
      </Box>
    </DrawerHeader>
  );
}

type SheetFooterProps = {
  children: ReactNode;
  className?: string;
};

export function SheetFooter({ children, className = "" }: SheetFooterProps) {
  return (
    <DrawerFooter
      flexShrink={0}
      borderTopWidth="1px"
      borderColor="gray.200"
      className={`dark:border-gray-700 dark:bg-gray-800 ${className}`}
      bg="gray.50"
      px={6}
      py={4}
    >
      <Box mx="auto" w="100%" maxW="4xl">
        <Flex direction="column" gap={3} w="100%" align="flex-end">
          {children}
        </Flex>
      </Box>
    </DrawerFooter>
  );
}

type SheetTitleProps = {
  children: ReactNode;
  className?: string;
};

export function SheetTitle({ children, className = "" }: SheetTitleProps) {
  return (
    <DrawerTitle fontSize="2xl" fontWeight="bold" color="gray.900" className={`dark:text-gray-100 ${className}`}>
      {children}
    </DrawerTitle>
  );
}

type SheetDescriptionProps = {
  children: ReactNode;
  className?: string;
};

export function SheetDescription({
  children,
  className = "",
}: SheetDescriptionProps) {
  return (
    <DrawerDescription fontSize="sm" color="gray.600" className={`dark:text-gray-400 ${className}`} mt={1}>
      {children}
    </DrawerDescription>
  );
}
