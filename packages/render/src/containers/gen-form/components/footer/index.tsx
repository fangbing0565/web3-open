import React from 'react';

interface FooterProps {
  title?: string;
}
const Footer = (props: FooterProps) => {
  const { title } = props;
  return <div>{title}</div>;
};
export default Footer;
