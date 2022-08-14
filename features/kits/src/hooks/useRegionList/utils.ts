export function filterGegionByKeywords(region: RegionType, keywords: string) {
    return (
      region?.name?.toLocaleLowerCase()?.includes(keywords.toLocaleLowerCase()) ||
      region?.properties?.dial_code?.includes(keywords) ||
      region?.code?.toLocaleLowerCase()?.includes(keywords.toLocaleLowerCase())
    );
  }
  