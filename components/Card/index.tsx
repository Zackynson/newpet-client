import React from 'react';

import styles from './styles.module.css';

const DoubleCard = ({children}:{children: React.ReactNode}) => {
  return <div className={styles.card}>
  {children}
</div>;
}

export default DoubleCard;