import React from 'react'
import Link from 'next/link'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader

import { Pet } from 'types/Pet'
import { PetInfo } from './components/PetInfo'
import {
  Button,
  Card,
  CardBody,
  Container,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import PetImages from './components/PetImages'
import PetAddress from './components/PetAddress'
import { AiOutlineWhatsApp } from 'react-icons/ai'

const PetDetail = ({ pet }: { pet?: Pet }) => {
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
        <PetImages pet={pet}></PetImages>
        <Card w="100%">
          <CardBody>
            <VStack align={'start'} gap={2}>
              <PetInfo pet={pet} />
              <PetAddress pet={pet}></PetAddress>
              <Button
                w={'full'}
                rightIcon={<AiOutlineWhatsApp />}
                colorScheme={'whatsapp'}
              >
                Exibir contato do responsável
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  )
}

export default PetDetail
