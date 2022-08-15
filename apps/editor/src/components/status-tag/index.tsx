import React from 'react';
import { StatusWrapper } from './styled';

interface StstusTagProps {
  text: string;
  color: string;
  link?: string;
}

const STATUS_TEXT_COLOR: Record<string, string> = {
  Green: '#12B312',
  Blue: '#369AFE',
  Red: '#F24141',
  Orange: '#FF860D',
  Gray: '#69718C',
};

const STATUS_BACKGROUD_COLOR: Record<string, string> = {
  Green: '#DDF3DD',
  Blue: '#E1F0FF',
  Red: '#FFE8E8',
  Orange: '#FFEEDE',
  Gray: '#F2F4FA',
};

const StatusTag = (props: StstusTagProps) => {
  const { text, color, link } = props;
  const handleClick = () => {
    if (link) {
      window.open(link);
    }
  };
  return (
    <StatusWrapper
      textColor={STATUS_TEXT_COLOR[color]}
      onClick={handleClick}
      backgroundColor={STATUS_BACKGROUD_COLOR[color]}>
      {text}
    </StatusWrapper>
  );
};

export default StatusTag;
