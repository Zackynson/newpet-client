import React, { useState } from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel } from 'react-responsive-carousel'

import { Pet } from 'types/Pet'
import { Box, Image } from '@chakra-ui/react'
import NoImageBg from '@public/assets/bg.png'

const PetImages = ({ pet }: { pet?: Pet }) => {
  if (!pet) {
    return (
      <Box w={'full'} bg="gray.500">
        <Image
          objectFit="contain"
          h={'lg'}
          src={NoImageBg.src}
          alt={'Ainda não temos fotos cadastradas'}
        />
      </Box>
    )
  }

  return (
    <Box w={'full'} bg="gray.500">
      <Carousel
        swipeable
        dynamicHeight
        emulateTouch
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        autoPlay={false}
      >
        {pet?.images?.map((i: string, index: number) => (
          <Image
            key={i + index}
            objectFit="contain"
            h={'lg'}
            src={i}
            alt={pet.name}
          />
        ))}
      </Carousel>
    </Box>
  )
}

export default PetImages
