import { Heading, VStack } from '@chakra-ui/react'
import React from 'react'
import { Pet } from 'types/Pet'

const PetAddress = ({ pet }: { pet: Pet }) => {
  return (
    <VStack align={'start'} w={'full'}>
      <Heading textAlign={'start'} size={'md'} my={4}>
        Where to find {pet.gender === 'male' ? 'him' : 'her'}
      </Heading>
      <iframe
        width="100%"
        height="450"
        loading="lazy"
        src={
          'https://www.google.com/maps/embed/v1/place?key=AIzaSyBeAhriPkltT2Z0Pg--4Z5Sm7U7PWLjBAs&q=' +
          pet.address
        }
      />
    </VStack>
  )
}

export default PetAddress
