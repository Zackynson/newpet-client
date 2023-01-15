import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { parseCookies } from 'nookies'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pet } from 'types/Pet'
import { useRouter } from 'next/router'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { dogBreeds } from './dog-breeds'
import { Breed } from 'types/BreedList'
import { catBreeds } from './cat-breeds'
import axios from 'axios'
import { api } from '@services/api'
import { toast } from 'react-toastify'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import moment from 'moment'

const minDate = moment(new Date()).subtract(26, 'years').toDate()
type Input = {
  name: string
  type: 'cat' | 'dog'
  breed: string
  birthDate: string
}

function PetDetailPage() {
  const [pet, setPet] = useState<Pet>()
  const [loading, setLoading] = useState<boolean>(false)
  const [animalType, setAnimalType] = useState('dog')
  const [animalBreedList, setAnimalBreedList] = useState<Breed[]>(dogBreeds)
  const [date, setDate] = useState<Date>(new Date())
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Input>()

  useEffect(() => {
    if (animalType === 'dog') setAnimalBreedList(dogBreeds)
    if (animalType === 'cat') setAnimalBreedList(catBreeds)
  }, [animalType])

  const createPet = useCallback(
    async (data: Partial<Pet>) => {
      setLoading(true)

      try {
        const res = await axios.post(
          '/api/pets/register',
          { ...data, birthDate: date },
          {
            headers: {
              authorization: api.defaults.headers.authorization as string,
            },
          },
        )

        setPet(res.data)
      } catch (error) {
        console.error(error)
        toast.error('Ocorreu um erro cadastrar seu pet')
      }

      setLoading(false)
    },
    [date],
  )

  return (
    <>
      <Head>
        <title>NEWPET | Cadastrar</title>
        <meta
          name="description"
          content="O melhor app de adoção de animais do Brasil"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container mt={8} maxW="container.lg" color="#262626">
        <Card>
          <CardHeader>
            <Heading>Cadastro de pet</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(createPet)}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Nome</FormLabel>
                <Input
                  {...register('name', { required: true })}
                  type="text"
                  name="name"
                />
                {!!errors.name ? (
                  <FormErrorMessage>Nome é obrigatório.</FormErrorMessage>
                ) : (
                  <></>
                )}
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.type}>
                <FormLabel>Tipo</FormLabel>
                <RadioGroup
                  onChange={(value) => setAnimalType(value)}
                  name="type"
                  defaultValue="dog"
                >
                  <Stack spacing={4} direction="row">
                    <Radio
                      {...register('type', { required: true })}
                      value="cat"
                    >
                      Gato
                    </Radio>
                    <Radio
                      {...register('type', { required: true })}
                      value="dog"
                    >
                      Cão
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl mt={4} isInvalid={!!errors.breed}>
                <FormLabel>Raça</FormLabel>

                <Select
                  placeholder="Selecione a raça"
                  {...register('breed', { required: true })}
                  name="breed"
                >
                  {animalBreedList.map((breed) => (
                    <option key={breed.name} value={breed.name}>
                      {breed.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Data de nascimento</FormLabel>

                <SingleDatepicker
                  date={date}
                  onDateChange={setDate}
                  name="birthDate"
                  configs={{
                    dateFormat: ' dd/MM/yyyy',
                  }}
                  maxDate={new Date()}
                  minDate={minDate}
                  propsConfigs={{
                    dateNavBtnProps: {
                      colorScheme: 'yellow',
                      variant: 'solid',
                    },
                    dayOfMonthBtnProps: {
                      defaultBtnProps: {
                        borderColor: 'yellow.300',
                        bg: 'yellow.100',
                        _hover: {
                          bg: 'yellow.400',
                        },
                      },
                    },
                  }}
                />
              </FormControl>

              <Button
                isLoading={loading}
                mt={6}
                colorScheme="yellow"
                type="submit"
              >
                Cadastrar
              </Button>
            </form>
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export default PetDetailPage
