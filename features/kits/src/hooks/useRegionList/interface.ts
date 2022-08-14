export interface LocalRegionType {
    geoname_id: number;
    code: string;
    name: string;
    asci_name: string;
    properties: {
      country_code: string;
      dial_code: string;
      flag_circle_url: string;
      official_language: string;
      official_language_code: string;
      time_zone: string;
      timezone_dst_offset: string;
      timezone_name: string;
      timezone_offset: string;
    };
  }
  