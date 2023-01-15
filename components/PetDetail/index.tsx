import React, { useState } from 'react'

import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel } from 'react-responsive-carousel'

import { Pet } from 'types/Pet'
import { PetInfo } from './components/PetInfo'
import {
  Button,
  Card,
  CardBody,
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
} from '@chakra-ui/react'

const PetDetail = ({ pet }: { pet?: Pet }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [imageIndex, setImageIndex] = useState<number>(0)
  if (!pet) return <Card>Pet não encontrado</Card>

  return (
    <Container maxW={'container.lg'} py="10">
      <VStack spacing="24px" direction={'column'}>
        <Card w="100%">
          <CardHeader>
            <Heading> Informações</Heading>
          </CardHeader>
          <CardBody>
            <PetInfo pet={pet} />
          </CardBody>
        </Card>
        <Card mt={'60'} maxW="container.lg" maxH="container.md">
          <CardHeader>
            <Heading>Galeria de {pet.name}</Heading>
          </CardHeader>

          <Flex
            justify={pet?.images?.length > 1 ? 'start' : 'center'}
            align={'center'}
            wrap="wrap"
            gap={{ base: 0, md: 1 }}
          >
            {pet?.images?.map((i: string, index: number) => (
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
            ))}
          </Flex>

          <Modal isCentered size="xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent
              onKeyDown={(e) => {
                if (['d', 'ArrowRight'].includes(e.key)) {
                  setImageIndex(
                    imageIndex === pet.images.length - 1 ? 0 : imageIndex + 1,
                  )
                }

                if (['a', 'ArrowLeft'].includes(e.key)) {
                  setImageIndex(
                    imageIndex === 0 ? pet.images.length - 1 : imageIndex - 1,
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
        </Card>
      </VStack>
    </Container>
  )
}

export default PetDetail
