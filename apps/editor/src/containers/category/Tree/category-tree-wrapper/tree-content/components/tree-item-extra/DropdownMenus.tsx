import React from 'react';
import { Modal, Menu } from '@i18n-ecom/ui';

enum ACTIONS {
  edit = '1',
  ban = '2',
  shield = '3',
}

const MODAL_ACTIONS = {
  [ACTIONS.edit]: null,
  [ACTIONS.ban]: {
    title: 'Ban category',
    content:
      'After the ban, the status of category will be changed to that of the banned category. Do you confirm the ban of category 1?',
    cancelText: 'Cancel',
    okText: 'Ok',
  },
  [ACTIONS.shield]: {
    title: 'Shielding category',
    content:
      'After shielding, the category status will be changed to be shielded. Are you sure to shield 1 category?',
    cancelText: 'Cancel',
    okText: 'Ok',
  },
} as { [key: string]: null | Parameters<typeof Modal.confirm>[0] };

export const DropdownMenus = () => {
  const handleClick = (key: string) => {
    const actionConfig = MODAL_ACTIONS[key];
    if (actionConfig) {
      Modal.confirm(actionConfig);
    }
  };
  return (
    <Menu onClickMenuItem={handleClick}>
      <Menu.Item key={ACTIONS.edit}>Edit</Menu.Item>
      <Menu.Item key={ACTIONS.ban}>Ban</Menu.Item>
      <Menu.Item key={ACTIONS.shield}>Shield</Menu.Item>
    </Menu>
  );
};
