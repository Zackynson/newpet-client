import React, { useState } from 'react'
import Link from 'next/link'
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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { useAuth } from '@contexts/AuthContext'

const PetDetail = ({ pet }: { pet?: Pet }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [imageIndex, setImageIndex] = useState<number>(0)
  const { user } = useAuth()
  if (!pet)
    return (
      <Link href="/">
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Pet não encontrado!</AlertTitle>
          <AlertDescription>Clique para voltar para a lista</AlertDescription>
        </Alert>
      </Link>
    )

  return (
    <Container maxW={'container.lg'} py="10">
      <VStack spacing="24px" direction={'column'}>
        <Card w="100%">
          <CardHeader>
            <Flex justify={'space-between'}>
              <Heading> Informações</Heading>
              {pet?.ownerId === user?._id ? (
                <Link href={'/pets/' + pet?._id + '/update'}>
                  <Button>Editar</Button>
                </Link>
              ) : (
                <></>
              )}
            </Flex>
          </CardHeader>
          <CardBody>
            <PetInfo pet={pet} />
          </CardBody>
        </Card>

        {pet.images.length ? (
          <>
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
                        imageIndex === pet.images.length - 1
                          ? 0
                          : imageIndex + 1,
                      )
                    }

                    if (['a', 'ArrowLeft'].includes(e.key)) {
                      setImageIndex(
                        imageIndex === 0
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
            </Card>
          </>
        ) : (
          <Card mt={'60'} maxW="container.lg" maxH="container.md">
            <CardHeader>
              <Heading>Ainda não temos fotos desse pet para exibir</Heading>
            </CardHeader>
          </Card>
        )}
      </VStack>
    </Container>
  )
}

export default PetDetail
