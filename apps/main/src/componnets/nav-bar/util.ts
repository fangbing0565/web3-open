export interface CountryInfo {
    id?: string;
    name?: string;
    code?: string;
    is_hidden?: boolean;
    order_factor?: string;
  }
  const LogisticsRegions: CountryInfo[] = [
    { code: 'DE', name: 'Germany' },
    { code: 'ES', name: 'Spain' },
    { code: 'FR', name: 'French' },
    { code: 'IT', name: 'Italy' },
    { code: 'PL', name: 'Poland' },
  ];
  const DagaRegions: CountryInfo[] = [
    {
      code: 'US',
      name: 'United States',
    },
  ];
  