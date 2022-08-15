import React, { CSSProperties } from 'react';
import cs from 'classnames';
import styles from './index.scss';

const Card = ({
  children,
  style,
  className,
}: {
  children: any;
  style?: CSSProperties;
  className?: string;
}) => {
  return (
    <div className={cs(styles.card, className)} style={style}>
      {children}
    </div>
  );
};

export default Card;
