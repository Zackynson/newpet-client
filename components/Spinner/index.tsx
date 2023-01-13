import styles from './styles.module.scss'

const Spinner = ({ type = 'primary' }) => (
  <div
    className={
      type === 'alt' ? styles['lds-ellipsis-alt'] : styles['lds-ellipsis']
    }
  >
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
)

export default Spinner
