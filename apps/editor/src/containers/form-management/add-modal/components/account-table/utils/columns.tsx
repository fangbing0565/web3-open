import { ColumnProps } from '@arco-design/web-react/es/Table/interface';

export const columns = () => {
  const columns: ColumnProps[] = [
    {
      title: 'Partner Country',
      width: 300,
      render: (_, record) => {
        const rule = record?.service_area_rule;
        return `${rule?.partner_country?.code} - ${rule?.category?.category_name} - ${rule?.seller_market.code}`;
      },
    },
  ];
  return columns;
};
