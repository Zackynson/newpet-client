import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { parseCookies } from 'nookies'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pet } from 'types/Pet'
import Router, { useRouter } from 'next/router'
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
import { Breed } from 'types/BreedList'
import axios from 'axios'
import { api } from '@services/api'
import { toast } from 'react-toastify'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import moment from 'moment'
import { dogBreeds } from '@libs/pets/dog-breeds'
import { catBreeds } from '@libs/pets/cat-breeds'
import GooglePlacesAutocomplete from 'chakra-ui-google-places-autocomplete'
import { PetType } from 'types/enums/pet-type.enum'
import { PetSize } from 'types/enums/pet-size.enum'

const minDate = moment(new Date()).subtract(26, 'years').toDate()
type Input = {
  name: string
  type: PetType
  breed: string
  birthDate: string
  size: PetSize
}

function RegisterPetPage() {
  const [loading, setLoading] = useState<boolean>(false)
  const [animalType, setAnimalType] = useState('dog')
  const [animalBreedList, setAnimalBreedList] = useState<Breed[]>(dogBreeds)
  const [date, setDate] = useState<Date>(new Date())
  const [addressInfo, setAddressInfo] = useState<any>()

  const router = useRouter()
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
        await toast.promise(
          axios.post(
            '/api/pets/register',
            {
              ...data,
              birthDate: date,
              address: addressInfo?.value?.description,
            },
            {
              headers: {
                authorization: api.defaults.headers.authorization as string,
              },
            },
          ),
          {
            success: 'Pet cadastrado com sucesso',
            pending: 'Cadastrando seu pet',
            error: 'Ocorreu um erro ao cadastrar seu pet',
          },
        )

        router.push('/')
      } catch (error) {
        console.error(error)
      }

      setLoading(false)
    },
    [addressInfo, date, router],
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
                  defaultValue="cat"
                  colorScheme={'purple'}
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
                      colorScheme: 'blue',
                      variant: 'solid',
                    },
                    dayOfMonthBtnProps: {
                      defaultBtnProps: {
                        borderColor: 'blue.300',
                        bg: 'blue.100',
                        _hover: {
                          bg: 'blue.400',
                        },
                      },
                    },
                  }}
                />
              </FormControl>

              <FormLabel mt={10}>Porte</FormLabel>
              <Select {...register('size', { required: true })} name="size">
                <option value="small">Pequeno</option>
                <option value="medium">Médio</option>
                <option value="big">Grande</option>
              </Select>

              <FormLabel mt={10}>Endereço onde ele está</FormLabel>
              <GooglePlacesAutocomplete
                apiKey="AIzaSyBeAhriPkltT2Z0Pg--4Z5Sm7U7PWLjBAs"
                selectProps={{
                  value: addressInfo,
                  onChange: setAddressInfo,
                }}
              />
              <Button
                isLoading={loading}
                mt={6}
                colorScheme="purple"
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

export default RegisterPetPage
