import React from 'react'
import { Pet } from 'types/Pet'

import moment from 'moment'
import Link from 'next/link'
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Image,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react'

const PetCard = ({ pet }: { pet: Pet }) => {
  const calculateAge = (date: string) => {
    try {
      var birthDate = moment(date, 'YYYYMMDD')

      const years = moment().diff(birthDate, 'years')
      if (years > 0)
        return (
          <>
            {' '}
            {years} {years === 1 ? 'ano' : 'anos'}
          </>
        )

      const months = moment().diff(birthDate, 'months')
      if (months > 0)
        return (
          <>
            {' '}
            {months} {months === 1 ? 'ano' : 'meses'}
          </>
        )

      const days = moment().diff(birthDate, 'days')
      return (
        <>
          {' '}
          {days} {days === 1 ? 'dia' : 'dias'}
        </>
      )
    } catch (error) {}

    return <></>
  }

  return (
    <Link href={'pets/' + pet._id}>
      <Card w={'lg'}>
        <CardHeader>
          <Heading size="md">{pet.name}</Heading>
        </CardHeader>
        <Stack divider={<StackDivider />}>
          <CardBody>
            <Stack divider={<StackDivider />}>
              <Box>
                <Image
                  borderRadius="lg"
                  w={'xl'}
                  style={{ objectFit: 'cover' }}
                  height={350}
                  src={pet?.images?.[0]}
                  alt={pet.name}
                  pt={-2}
                />
              </Box>
            </Stack>
          </CardBody>
          <CardFooter>
            <Text fontSize="sm">
              {pet.name} - {pet.breed} - {calculateAge(pet.birthDate)}
            </Text>
          </CardFooter>
        </Stack>
      </Card>
    </Link>
  )
}

export default PetCard
