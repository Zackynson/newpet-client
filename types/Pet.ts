export interface Pet {
  _id: string
  name: string
  ownerId: string
  owner?: {
    name?: string
    _id?: string
  }
  type: string
  breed: string
  birthDate: string
  createdAt?: string
  updatedAt?: string
  images: string[]
}
