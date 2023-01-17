import React, { useState } from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel } from 'react-responsive-carousel'

import { Pet } from 'types/Pet'
import {
  Button,
  Card,
  CardHeader,
  Container,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
  Box,
  useMediaQuery,
} from '@chakra-ui/react'

const PetImages = ({ pet }: { pet?: Pet }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [imageIndex, setImageIndex] = useState<number>(0)
  const [isMobile] = useMediaQuery('(max-width: 768px)')

  if (!pet) return <></>

  return (
    <VStack spacing="24px" direction={'column'}>
      {pet?.images?.length ? (
        <>
          <Card
            maxW="container.lg"
            overflow={'hidden'}
            w={'full'}
            maxH="container.md"
          >
            <CardHeader>
              <Heading>Galeria de {pet.name}</Heading>
            </CardHeader>

            <Flex
              justify={'space-evenly'}
              p="0"
              m="0"
              w={'full'}
              wrap="wrap"
              gap={1}
              mb={1}
            >
              {isMobile ? (
                <Carousel
                  swipeable
                  emulateTouch
                  showThumbs={false}
                  selectedItem={imageIndex || 0}
                  onChange={(i) => setImageIndex(i)}
                >
                  {pet?.images?.map((i: string, index: number) => (
                    <Image
                      key={i + index}
                      objectFit="cover"
                      h={'lg'}
                      src={i}
                      alt={pet.name}
                    />
                  ))}
                </Carousel>
              ) : (
                pet?.images?.map((i: string, index: number) => (
                  <Box key={i + index}>
                    <Image
                      cursor="pointer"
                      onClick={() => {
                        setImageIndex(index)
                        onOpen()
                      }}
                      objectFit="cover"
                      h={'xs'}
                      w={'xs'}
                      src={i}
                      alt={pet.name}
                    />
                  </Box>
                ))
              )}
            </Flex>
          </Card>

          <Modal isCentered size="xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent
              onKeyDown={(e) => {
                if (['d', 'ArrowRight'].includes(e.key)) {
                  setImageIndex(
                    pet?.images?.length && imageIndex === pet.images.length - 1
                      ? 0
                      : imageIndex + 1,
                  )
                }

                if (['a', 'ArrowLeft'].includes(e.key)) {
                  setImageIndex(
                    pet?.images?.length && imageIndex === 0
                      ? pet.images.length - 1
                      : imageIndex - 1,
                  )
                }
              }}
            >
              <ModalHeader>Galeria de {pet.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Carousel
                  swipeable
                  emulateTouch
                  showThumbs={false}
                  selectedItem={imageIndex || 0}
                  onChange={(i) => setImageIndex(i)}
                >
                  {pet?.images?.map((i: string, index: number) => (
                    <Image
                      key={i + index}
                      objectFit="cover"
                      h={'lg'}
                      src={i}
                      alt={pet.name}
                    />
                  ))}
                </Carousel>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Fechar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <Card maxW="container.lg" maxH="container.md">
          <CardHeader>
            <Heading>Ainda não temos fotos desse pet para exibir</Heading>
          </CardHeader>
        </Card>
      )}
    </VStack>
  )
}

export default PetImages
