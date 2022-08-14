import { useState, useEffect, useCallback } from 'react';
import { getGeographyAPI } from './fetchers';
import { filterGegionByKeywords } from './utils';

const useRegionList = () => {
  const [regionList, setRegionList] = useState<RegionType[]>([]);
  const initRegionList = async () => {
    const regionList = await getGeographyAPI();
    setRegionList(regionList);
  };
  useEffect(() => {
    initRegionList();
  }, []);
  const getRegionInfoByCode = useCallback(
    (regionCode: string) => {
      return regionList.find(
        region =>
          region?.code?.toLocaleLowerCase() === regionCode.toLocaleLowerCase(),
      );
    },
    [regionList],
  );

  const getRegionListByKeywords = useCallback(
    (keywords: string) => {
      return regionList.filter(region =>
        filterGegionByKeywords(region, keywords),
      );
    },
    [regionList],
  );

  return { regionList, getRegionInfoByCode, getRegionListByKeywords };
};
export default useRegionList;
