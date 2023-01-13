import moment from 'moment'
import { Pet } from 'types/Pet'

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

export const PetInfo = ({ pet }: { pet: Pet }) => {
  return (
    <div>
      <div>
        <strong>{pet.name}:</strong>
        <p>
          é um <strong>{pet.type === 'cat' ? 'gato' : 'cachorro'}</strong>
        </p>
        <p>
          da raça <strong>&apos;{pet.breed}&apos;</strong>
        </p>
        <p>
          tem <strong>{calculateAge(pet.birthDate)}</strong> de vida
        </p>
      </div>
      <p style={{ marginTop: '1rem' }}>
        gostou dele? entre em contato <br></br>com o responsável clicando aqui.
      </p>
    </div>
  )
}
