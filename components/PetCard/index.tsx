import React, { useMemo } from 'react'
import { Pet } from 'types/Pet'

import {
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Stack,
  StackDivider,
  Icon,
  CardHeader,
} from '@chakra-ui/react'

import fallbackimage from '@public/assets/fallback.png'
import { FaCat, FaDog } from 'react-icons/fa'

const PetCard = ({ pet }: { pet: Pet; gray?: boolean }) => {
  return (
    <Card w={'xs'}>
      <Stack divider={<StackDivider />}>
        <CardBody>
          <Image
            borderRadius="lg"
            w={'100%'}
            height={300}
            objectFit="cover"
            src={pet?.images?.[0]}
            alt={pet.name}
            pt={-2}
            fallbackSrc={fallbackimage.src}
          />
        </CardBody>
        <CardFooter
          textAlign="center"
          textTransform="capitalize"
          display="flex"
          justify="center"
          alignItems="center"
          py={2}
        >
          <Heading overflow={'auto'} textAlign="center" size="sm" mb={2}>
            {pet.name}
          </Heading>
        </CardFooter>
      </Stack>
    </Card>
  )
}

export default PetCard
