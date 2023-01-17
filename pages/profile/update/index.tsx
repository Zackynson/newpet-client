// users/63bb29eb59818ee972ced9c0/avatar
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Container,
  Flex,
  FormLabel,
  Grid,
  Heading,
  Image,
  VStack,
} from '@chakra-ui/react'
import { useAuth } from '@contexts/AuthContext'
import { api } from '@services/api'
import axios from 'axios'
import React, { useCallback, useState } from 'react'
import ReactImageUploading from 'react-images-uploading'
import { toast } from 'react-toastify'

// import { Container } from './styles';

const UpdateUser = () => {
  const { user } = useAuth()
  const [images, setImage] = useState<any>()

  const onChangeImages = (imageList: any, addUpdateIndex: any) => {
    setImage(imageList)
  }

  const updateProfilePicture = useCallback(async () => {
    if (!images?.[0]?.data_url) return console.log('sem foto')

    toast.promise(
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
        error: 'Ocorreu um erro ao atualizar sua foto',
        pending: 'Atualizando sua foto de perfil',
        success: 'Foto atualizada com sucesso',
      },
    )
  }, [images])

  return (
    <Container maxW="container.lg">
      <Center>
        <VStack flex={'1'}>
          <Heading my={5}>{user?.name}</Heading>

          <Card flex={1} w="lg">
            <CardBody>
              <FormLabel textAlign={'center'}>Foto de perfil</FormLabel>

              <Center>
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
                            <span>Your selected file type is not allow</span>
                          )}
                          {imageErrors.maxFileSize && (
                            <span>Selected file size exceed maxFileSize</span>
                          )}
                          {imageErrors.resolution && (
                            <span>
                              Selected file is not match your desired resolution
                            </span>
                          )}
                        </div>
                      )}
                      {/* imagens que ja estao no pet */}

                      {imageList?.length ? (
                        imageList.map((image: any, index: any) => (
                          <Flex
                            direction={'column'}
                            justify="space-between"
                            textAlign={'center'}
                            key={index}
                            className="image-item"
                          >
                            <Image
                              border={'1px'}
                              src={image['data_url']}
                              alt=""
                              maxH={40}
                              maxW={40}
                              minW={40}
                              minH={40}
                              borderRadius="full"
                              flex={1}
                              objectFit="cover"
                              justifySelf="center"
                              alignSelf={'center'}
                            />
                            <Box>
                              <Button
                                my={2}
                                type="button"
                                variant={'outline'}
                                colorScheme="red"
                                onClick={() => onImageRemove(index)}
                              >
                                Remover
                              </Button>
                            </Box>
                          </Flex>
                        ))
                      ) : (
                        <Button
                          type="button"
                          style={isDragging ? { color: 'red' } : undefined}
                          onClick={onImageUpload}
                          {...dragProps}
                          maxH={40}
                          maxW={40}
                          minW={40}
                          minH={40}
                          overflow="hidden"
                          border={'1px'}
                          borderRadius="full"
                        >
                          Clique ou <br />
                          arraste ate aqui
                        </Button>
                      )}
                    </Box>
                  )}
                </ReactImageUploading>
              </Center>

              <CardFooter>
                <Button onClick={updateProfilePicture} w={'lg'}>
                  Salvar
                </Button>
              </CardFooter>
            </CardBody>
          </Card>
        </VStack>
      </Center>
    </Container>
  )
}

export default UpdateUser
