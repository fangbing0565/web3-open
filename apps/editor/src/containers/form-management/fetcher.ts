import {
    partnerOpAPIClient,
    ServiceableType,
  } from '@/api/operation/serv/oec_operation_partner_op_api';
  
  // export const getCountry = () => {
  //   return fetch(
  //     'https://location.bytedance.com/bytemap/v1/config/region_profile?language=zh-CN&key=ceb6c970658f31504a901b89dcd3e461',
  //     {
  //       headers: { 'Content-Type': 'application/json' },
  //       method: 'get',
  //     },
  //   ).then(res => res.json());
  // };
  
  export const getCountry = () => {
    return partnerOpAPIClient.PartnerCountryQuery({});
  };
  
  export const getCategory = () => {
    return partnerOpAPIClient.CategoryQuery({
      serviceable_type: ServiceableType.CUSTOM,
    });
  };
  
  export const getSellerMarket = () => {
    return partnerOpAPIClient.SellerMarketQuery({});
  };
  