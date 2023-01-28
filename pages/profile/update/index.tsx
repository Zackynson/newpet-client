import { SmallCloseIcon } from '@chakra-ui/icons'
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  Spinner,
  VStack,
} from '@chakra-ui/react'
import { useAuth } from '@contexts/AuthContext'
import { UpdateUserDTO } from '@libs/dtos'
import { api } from '@services/api'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import React, { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import ReactImageUploading from 'react-images-uploading'
import { toast } from 'react-toastify'

const UpdateUser = () => {
  const { user, loading } = useAuth()
  const [initializedAvatar, setInitializedAvatar] = useState<boolean>(false)
  const [images, setImage] = useState<any>([])
  const { register, handleSubmit } = useForm<UpdateUserDTO>()

  const onChangeImages = (imageList: any, addUpdateIndex: any) => {
    setImage(imageList)
  }

  useMemo(() => {
    if (user && !initializedAvatar) {
      setInitializedAvatar(true)
      setImage([{ data_url: user.avatar }])
    }
  }, [user, initializedAvatar, setImage])

  const updateProfilePicture = useCallback(
    async (data: UpdateUserDTO) => {
      const { name, phone } = data

      const promises = []

      toast.promise(
        axios.post(
          `/api/me/update-info`,
          { name, phone },
          {
            headers: {
              authorization: api.defaults.headers.authorization as string,
            },
          },
        ),
        {
          error: 'Erro ao atualizar informações',
          success: 'Informações atualizadas com sucesso',
          pending: 'Atualizando informações...',
        },
      )

      if (images?.[0]?.data_url) {
        await toast.promise(
          axios.post(
            `/api/me/update-avatar`,
            { image: images?.[0]?.data_url },
            {
              headers: {
                authorization: api.defaults.headers.authorization as string,
              },
            },
          ),
          {
            error: 'Erro ao atualizar Imagem',
            success: 'Imagem atualizada com sucesso',
            pending: 'Atualizando Imagem...',
          },
        )
      }
    },
    [images],
  )

  return (
    <Container h={'100%'} py={10} maxW="container.lg">
      <Center h={'100%'}>
        <VStack flex={'1'}>
          <Card flex={1} w="lg">
            <CardHeader textAlign={'center'}>
              <Heading>Editar perfil</Heading>
            </CardHeader>
            {loading ? (
              <CardBody>
                <Spinner></Spinner>
              </CardBody>
            ) : (
              <CardBody>
                <form onSubmit={handleSubmit(updateProfilePicture)}>
                  <Center>
                    <VStack w={400}>
                      <ReactImageUploading
                        value={images}
                        onChange={onChangeImages}
                        maxNumber={1}
                        dataURLKey="data_url"
                      >
                        {({
                          imageList,
                          onImageUpload,
                          onImageRemove,
                          isDragging,
                          dragProps,
                          errors: imageErrors,
                        }) => (
                          <Box>
                            {imageErrors && (
                              <div>
                                {imageErrors.maxNumber && (
                                  <span>
                                    Number of selected images exceed maxNumber
                                  </span>
                                )}
                                {imageErrors.acceptType && (
                                  <span>
                                    Your selected file type is not allow
                                  </span>
                                )}
                                {imageErrors.maxFileSize && (
                                  <span>
                                    Selected file size exceed maxFileSize
                                  </span>
                                )}
                                {imageErrors.resolution && (
                                  <span>
                                    Selected file is not match your desired
                                    resolution
                                  </span>
                                )}
                              </div>
                            )}

                            {imageList?.length ? (
                              imageList.map((image: any, index: any) => (
                                <Flex
                                  direction={'column'}
                                  justify="space-between"
                                  textAlign={'center'}
                                  key={index}
                                  className="image-item"
                                >
                                  <Center>
                                    <Avatar size="xl" src={image['data_url']}>
                                      <AvatarBadge
                                        as={IconButton}
                                        size="sm"
                                        rounded="full"
                                        top="-10px"
                                        colorScheme="red"
                                        objectFit={'cover'}
                                        objectPosition="center"
                                        aria-label="remove Image"
                                        icon={<SmallCloseIcon />}
                                        onClick={() => onImageRemove(index)}
                                      />
                                    </Avatar>
                                  </Center>
                                </Flex>
                              ))
                            ) : (
                              <Avatar
                                onClick={onImageUpload}
                                size="xl"
                                cursor={'pointer'}
                              />
                            )}
                          </Box>
                        )}
                      </ReactImageUploading>

                      <FormControl
                        defaultValue={user?.name}
                        {...register('name')}
                      >
                        <FormLabel htmlFor="name">Nome:</FormLabel>
                        <Input name="name" defaultValue={user?.name} />
                      </FormControl>
                      <FormControl
                        defaultValue={user?.phone}
                        {...register('phone')}
                      >
                        <FormLabel>Whatsapp:</FormLabel>
                        <Input name="phone" defaultValue={user?.phone} />
                      </FormControl>
                    </VStack>
                  </Center>

                  <CardFooter>
                    <Button colorScheme={'purple'} type="submit" w={'lg'}>
                      Salvar
                    </Button>
                  </CardFooter>
                </form>
              </CardBody>
            )}
          </Card>
        </VStack>
      </Center>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['newpet-token']: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default UpdateUser
