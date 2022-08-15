import {
    SchemaFormOption,
    FORM_ITEM_TYPE,
  } from '@m4b-design/pearl-schema-form';
  
  export const DefaultColSpan: {
    span: number;
    style: {
      padding: string;
    };
  } = {
    span: 8,
    style: {
      padding: '0 16px',
    },
  };
  
  export const getOptions = (selectAll: any): SchemaFormOption[] => {
    return [
      {
        label: 'Country',
        type: FORM_ITEM_TYPE.SELECT,
        field: 'partner_country_code_modal',
        colSpan: DefaultColSpan,
        submitWhenChange: true,
        customProps: {
          showSearch: true,
          filterOption: true,
          placeholder: 'Please select',
          options: selectAll[0]?.partner_countries?.map((item: any) => ({
            label: item.code,
            value: item.code,
          })),
        },
        rules: [
          {
            required: true,
            message: 'Please select Country',
          },
        ],
      },
      {
        label: 'Category',
        type: FORM_ITEM_TYPE.SELECT,
        field: 'category_id_modal',
        colSpan: DefaultColSpan,
        submitWhenChange: true,
        customProps: {
          placeholder: 'Please select',
          options: selectAll[1]?.categories?.map((item: any) => ({
            label: item.category_name,
            value: item.category_id,
          })),
        },
      },
      {
        label: 'Target Market',
        type: FORM_ITEM_TYPE.SELECT,
        field: 'seller_market_modal',
        colSpan: DefaultColSpan,
        submitWhenChange: true,
        customProps: {
          placeholder: 'Please select',
          options: selectAll[2]?.seller_markets?.map((item: any) => ({
            label: item.code,
            value: item.code,
          })),
        },
      },
    ];
  };
  