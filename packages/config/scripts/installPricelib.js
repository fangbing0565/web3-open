#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const INIT_CONFIG = `window.DEFAULT_CURRENCY_CONFIG ={
    "separator": {
        "separator_map": {
            "common": [
                3,
                6,
                9,
                12,
                15,
                18
            ],
            "india": [
                3,
                5,
                7,
                9,
                11,
                13,
                15,
                17
            ]
        }
    },
    "currency_list": [
        {
            "name": "USD",
            "symbol": "$",
            "symbol_position": 1,
            "decimal_places": 2,
            "decimal_symbol": ".",
            "separator": ",",
            "separator_index": "common",
            "between": "",
            "country_code": "US",
            "country_geo_name_id": 6252001,
            "lowest_sale_price": "0.01"
        },
        {
            "name": "GBP",
            "symbol": "£",
            "symbol_position": 1,
            "decimal_places": 2,
            "decimal_symbol": ".",
            "separator": ",",
            "separator_index": "common",
            "between": "",
            "country_code": "GB",
            "country_geo_name_id": 2635167,
            "lowest_sale_price": "0.01"
        },
        {
            "name": "IDR",
            "symbol": "Rp",
            "symbol_position": 1,
            "decimal_places": 0,
            "decimal_symbol": ",",
            "separator": ".",
            "separator_index": "common",
            "between": "",
            "country_code": "ID",
            "country_geo_name_id": 1643084,
            "lowest_sale_price": "100"
        },
        {
            "name": "RUB",
            "symbol": "руб.",
            "symbol_position": 0,
            "decimal_places": 2,
            "decimal_symbol": ",",
            "separator": " ",
            "separator_index": "common",
            "between": " ",
            "country_code": "RU",
            "country_geo_name_id": 2017370,
            "lowest_sale_price": "0.01"
        },
        {
            "name": "JPY",
            "symbol": "￥",
            "symbol_position": 1,
            "decimal_places": 0,
            "decimal_symbol": ".",
            "separator": ",",
            "separator_index": "common",
            "between": "",
            "country_code": "JP",
            "country_geo_name_id": 1861060,
            "lowest_sale_price": "1"
        },
        {
            "name": "INR",
            "symbol": "₹",
            "symbol_position": 1,
            "decimal_places": 0,
            "decimal_symbol": ".",
            "separator": ",",
            "separator_index": "india",
            "between": "",
            "country_code": "IN",
            "country_geo_name_id": 1269750
        },
        {
            "name": "CNY",
            "symbol": "¥",
            "symbol_position": 1,
            "decimal_places": 2,
            "decimal_symbol": ".",
            "separator": ",",
            "separator_index": "common",
            "between": "",
            "country_code": "CN",
            "country_geo_name_id": 1269751
        },
        {
            "name": "CAD",
            "symbol": "$",
            "symbol_position": 1,
            "decimal_places": 2,
            "decimal_symbol": ".",
            "separator": ",",
            "separator_index": "common",
            "between": "",
            "country_code": "CA",
            "country_geo_name_id": 0,
            "lowest_sale_price": "0.01"
        },
        {
            "name": "EUR",
            "symbol": "€",
            "symbol_position": 0,
            "decimal_places": 2,
            "decimal_symbol": ".",
            "separator": ",",
            "separator_index": "common",
            "between": "",
            "country_code": "FR",
            "country_geo_name_id": 3017382,
            "lowest_sale_price": "0.01"
        },
        {
            "name": "EUR",
            "symbol": "€",
            "symbol_position": 0,
            "decimal_places": 2,
            "decimal_symbol": ".",
            "separator": ",",
            "separator_index": "common",
            "between": "",
            "country_code": "ES",
            "country_geo_name_id": 2510769,
            "lowest_sale_price": "0.01"
        },
        {
            "name": "EUR",
            "symbol": "€",
            "symbol_position": 0,
            "decimal_places": 2,
            "decimal_symbol": ".",
            "separator": ",",
            "separator_index": "common",
            "between": "",
            "country_code": "DE",
            "country_geo_name_id": 2921044,
            "lowest_sale_price": "0.01"
        },
        {
            "name": "EUR",
            "symbol": "€",
            "symbol_position": 0,
            "decimal_places": 2,
            "decimal_symbol": ".",
            "separator": ",",
            "separator_index": "common",
            "between": "",
            "country_code": "IT",
            "country_geo_name_id": 3175395,
            "lowest_sale_price": "0.01"
        },
        {
            "name": "AUD",
            "symbol": "$",
            "symbol_position": 1,
            "decimal_places": 2,
            "decimal_symbol": ".",
            "separator": ",",
            "separator_index": "common",
            "between": "",
            "country_code": "AU",
            "country_geo_name_id": 1,
            "lowest_sale_price": "0.01"
        },
        {
            "name": "BRL",
            "symbol": "R$",
            "symbol_position": 1,
            "decimal_places": 2,
            "decimal_symbol": ".",
            "separator": ",",
            "separator_index": "common",
            "between": "",
            "country_code": "BR",
            "country_geo_name_id": 2,
            "lowest_sale_price": "0.01"
        },
        {
            "name": "MYR",
            "symbol": "RM",
            "symbol_position": 1,
            "decimal_places": 2,
            "decimal_symbol": ".",
            "separator": ",",
            "separator_index": "common",
            "between": "",
            "country_code": "MY",
            "country_geo_name_id": 1733045,
            "lowest_sale_price": "0.01"
        },
        {
            "name": "THB",
            "symbol": "฿",
            "symbol_position": 1,
            "decimal_places": 2,
            "decimal_symbol": ".",
            "separator": ",",
            "separator_index": "common",
            "between": "",
            "country_code": "TH",
            "country_geo_name_id": 1605651,
            "lowest_sale_price": "0.01"
        },
        {
            "name": "SGD",
            "symbol": "S$",
            "symbol_position": 1,
            "decimal_places": 2,
            "decimal_symbol": ".",
            "separator": ",",
            "separator_index": "common",
            "between": "",
            "country_code": "SG",
            "country_geo_name_id": 1880251,
            "lowest_sale_price": "0.01"
        },
        {
            "name": "PHP",
            "symbol": "₱",
            "symbol_position": 1,
            "decimal_places": 2,
            "decimal_symbol": ".",
            "separator": ",",
            "separator_index": "common",
            "between": "",
            "country_code": "PH",
            "country_geo_name_id": 1694008,
            "lowest_sale_price": "0.01"
        },
        {
            "name": "VND",
            "symbol": "₫",
            "symbol_position": 0,
            "decimal_places": 0,
            "decimal_symbol": ".",
            "separator": ".",
            "separator_index": "common",
            "between": "",
            "country_code": "VN",
            "country_geo_name_id": 1562822,
            "lowest_sale_price": "1"
        },
        {
            "name": "PLN",
            "symbol": "zł",
            "symbol_position": 0,
            "decimal_places": 2,
            "decimal_symbol": ",",
            "separator": " ",
            "separator_index": "common",
            "between": "",
            "country_code": "PL",
            "country_geo_name_id": 798544,
            "lowest_sale_price": "0.01"
        }
    ]
}`;

/** *** install price lib ****/
(async function () {
  await (function () {
    let priceLibConfig = INIT_CONFIG;
    // eslint-disable-next-line no-console
    console.log('- start downloading priceLib');
    return axios
      .get(
        'https://sf16-tcc-tos-sg.byteoversea.com/obj/tcc-config-web-alisg/tcc-v2-data-oec.promotion.price_lib-default',
      )
      .then(function (response) {
        if (response.status === 200) {
          const config = response.data;
          priceLibConfig = `window.DEFAULT_CURRENCY_CONFIG =${config.data.CurrencyConf}`;
        } else {
          throw new Error('fail to download the price config');
        }
      })
      .finally(() => {
        const priceLbPath = path.resolve(
          __dirname,
          '../jupiter/ini-settings/injected-js/price-lib.js',
        );
        // eslint-disable-next-line no-console
        console.log('- √ finish priceLib');
        if (!fs.existsSync(priceLbPath)) {
          fs.writeFileSync(priceLbPath, priceLibConfig);
        }
      });
  })();
})();
