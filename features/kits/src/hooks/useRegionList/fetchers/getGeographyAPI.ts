export const GeographyAPI =
  'https://location.bytedance.com/bytemap/v1/config/region_profile?key=ceb6c970658f31504a901b89dcd3e461';
let data: any;

export const getGeographyAPI = async (): Promise<RegionType[]> => {
  const headers = { 'Content-Type': 'application/json' };
  const method = 'GET';
  if (data?.district?.length) {
    return data?.district || [];
  }
  try {
    const response = await fetch(GeographyAPI, {
      headers,
      method,
    });
    data = await response.json();
  } catch (error) {}
  return data?.district || [];
};
