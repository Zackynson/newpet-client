import React from 'react';

import styles from './styles.module.css';

const DoubleCard = ({left, right}:{left: React.ReactNode, right:React.ReactNode}) => {
  return <div className={styles.card}>
  {left}
  {right}
</div>;
}

export default DoubleCard;