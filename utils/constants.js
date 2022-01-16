const exampleState = {
  categories: [
    {
      itemId: 1,
      item: { name: "crypto", position: 1, enabled: true, percentage: true },
    },
    {
      itemId: 1,
      item: { name: "banks", position: 2, enabled: true, percentage: true },
    },
    {
      itemId: 1,
      item: {
        name: "realEstate",
        position: 3,
        enabled: true,
        percentage: true,
      },
    },
    {
      itemId: 1,
      item: { name: "pensions", position: 4, enabled: true, percentage: true },
    },
    {
      itemId: 1,
      item: { name: "mortgage", position: 5, enabled: false, percentage: true },
    },
    {
      itemId: 1,
      item: {
        name: "commodities",
        position: 6,
        enabled: false,
        percentage: true,
      },
    },
    {
      itemId: 1,
      item: { name: "stocks", position: 7, enabled: false, percentage: true },
    },
    {
      itemId: 1,
      item: { name: "goods", position: 8, enabled: false, percentage: true },
    },
    {
      itemId: 1,
      item: { name: "loans", position: 9, enabled: false, percentage: true },
    },
    {
      itemId: 1,
      item: { name: "other", position: 10, enabled: false, percentage: true },
    },
  ],
  assets: [
    {
      item: {
        id: 2,
        institution: 1,
        name: "Savings",
        currency: "USD",
        holdings: 5000,
        interest: "0.1",
        locked: true,
        hidden: false,
        dataPoints: [
          { holdings: 5000, datetime: "2017-03-01T12:00:00+00:00", notes: "" },
        ],
        itemId: 1,
      },
    },
    {
      item: {
        id: 1,
        institution: 1,
        name: "Current account",
        currency: "USD",
        holdings: 1000,
        interest: 0,
        locked: false,
        hidden: false,
        dataPoints: [
          { holdings: 1000, datetime: "2021-03-07T00:59:56+00:00", notes: "" },
        ],
        itemId: 1,
      },
    },
    {
      item: {
        id: 3,
        institution: 2,
        name: "My House",
        currency: "USD",
        holdings: 150000,
        interest: 0,
        locked: true,
        hidden: false,
        dataPoints: [
          {
            holdings: 150000,
            datetime: "2021-03-07T01:26:58+00:00",
            notes: "",
          },
          {
            holdings: 100000,
            datetime: "2009-03-06T12:00:00+00:00",
            notes: "",
          },
        ],
        itemId: 1,
      },
    },
    {
      item: {
        id: 4,
        institution: 3,
        name: "House mortgage",
        currency: "USD",
        holdings: 20000,
        interest: "2.24",
        locked: true,
        hidden: false,
        liability: true,
        dataPoints: [
          { holdings: 20000, datetime: "2021-03-07T01:34:17+00:00", notes: "" },
          { holdings: 80000, datetime: "2012-03-01T12:00:00+00:00", notes: "" },
        ],
        itemId: 1,
      },
    },
    {
      item: {
        id: 5,
        institution: 4,
        name: "Bitcoin",
        currency: "BTC",
        holdings: 0.001,
        interest: 0,
        locked: false,
        hidden: false,
        dataPoints: [
          { holdings: 0.001, datetime: "2019-03-01T12:00:00+00:00", notes: "" },
        ],
        itemId: 1,
      },
    },
    {
      item: {
        id: 6,
        institution: 5,
        name: "First Job",
        currency: "USD",
        holdings: 10000,
        interest: "2",
        locked: true,
        hidden: false,
        dataPoints: [
          { holdings: 10000, datetime: "2016-03-01T12:00:00+00:00", notes: "" },
        ],
        itemId: 1,
      },
    },
  ],
  currency: "GBP",
  country: "USA",
  inflation: true,
  institutions: [
    {
      item: {
        id: 1,
        category: "banks",
        name: "My bank",
        backgroundColor: "#00F",
        color: "#FFF",
      },
      itemId: 1,
    },
    {
      item: {
        id: 2,
        category: "realEstate",
        name: "MyTown",
        backgroundColor: "#F00",
        color: "#FFF",
      },
      itemId: 1,
    },
    {
      item: {
        id: 3,
        category: "mortgage",
        name: "Bank Of Loans",
        backgroundColor: "#4169e1",
        color: "#FFD700",
      },
      itemId: 1,
    },
    {
      item: {
        id: 4,
        category: "crypto",
        name: "Crypto.com",
        backgroundColor: "#061221",
        color: "#FFF",
      },
      itemId: 1,
    },
    {
      item: {
        id: 5,
        category: "pensions",
        name: "Work Pension",
        backgroundColor: "#329239",
        color: "#FFF",
      },
      itemId: 1,
    },
  ],
  totalDisplayed: true,
}

// change Currency.master_currencies in backend if changed
const CURRENCIES = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  SGD: "SG$",
  XAU: "Gold",
  XAG: "Silver",
  BTC: "BTC",
  ETH: "ETH",
}

const COUNTRIES = {
  USA: "US",
  GBR: "UK",
  FRA: "France",
  AUS: "Australia",
  SGP: "Singapore",
}
const CATEGORIES = {
  crypto: "Crypto",
  banks: "Banking",
  pensions: "Pensions",
  realEstate: "Real Estate",
  mortgage: "Mortgage",
  loans: "Loans",
  other: "Other",
  goods: "Goods and art",
  commodities: "Commodities",
  stocks: "Stock Market",
}
const INSTITUTIONS_PLACEHOLDER = {
  crypto: "Binance",
  banks: "CitiBank",
  realEstate: "My House",
  pensions: "Legal & General",
  mortgage: "Mortgage.com",
  loans: "Grandma",
  other: "The government",
  goods: "My safe",
  commodities: "CBOE",
  stocks: "Robinhood",
}

const CATEGORIES_COLOURS = {
  crypto: "#f7931a",
  banks: "#545454",
  pensions: "#329239",
  realEstate: "#4169e1",
  mortgage: "#8b0000",
  commodities: "#FFD700",
  stocks: "#000",
  goods: "#ff748c ",
  loans: "#800080",
  other: "#556b2f",
}
const BLOCKED_CATEGORIES = ["commodities", "stocks"]
const LIABLE_CATEGORIES = ["mortgage", "loans"]

export const constants = {
  exampleState,
  CURRENCIES,
  COUNTRIES,
  CATEGORIES,
  INSTITUTIONS_PLACEHOLDER,
  CATEGORIES_COLOURS,
  BLOCKED_CATEGORIES,
  LIABLE_CATEGORIES,
}
