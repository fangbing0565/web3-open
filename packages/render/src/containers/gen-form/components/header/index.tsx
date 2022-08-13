import React from 'react';
interface HeaderProps {
  title: string;
}
const Header = (props: HeaderProps) => {
  const { title } = props;
  return <div>{title}</div>;
};
export default Header;
