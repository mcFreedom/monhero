import { useState, useEffect } from "react"
import { constants } from "../utils"
import axios from "axios"
import Select from "react-select"

const { CURRENCIES } = constants
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const initialOptions = Object.keys(CURRENCIES).map((currency) => {
  return [{ value: currency, label: CURRENCIES[currency] }]
})

const themer = (theme) => {
  return {
    ...theme,
    borderRadius: 10,
    height: 40,
    width: "100%",
    placeholder: {
      color: "red",
    },
    colors: {
      ...theme.colors,
      primary25: "hotpink",
      primary: "black",
      secondary: "hotpink",
    },
  }
}

export const CurrencyList = ({
  clearable = false,
  inputValueProp = "",
  handleChange = () => {},
  initialCurrency = "USD",
}) => {
  const [options, setOptions] = useState(initialOptions)
  const [, setInputValue] = useState("")

  const getRates = async () => {
    await axios(`${BACKEND_URL}/currency-list?currency-picker=true`)
      .then((response) => {
         setOptions(response.data)
      })
      .catch((error) => {
        console.error("Error fetching data: ", error)
      })
  }

  useEffect(() => {
    setInputValue(inputValueProp)
  }, [inputValueProp])
  useEffect(() => {
    getRates()
  }, [])

  return (
    <Select
      options={options}
      defaultInputValue={initialCurrency}
      name="currency"
      theme={(theme) => themer(theme)}
      // styles={colourStyles}
      isClearable={clearable}
      onChange={handleChange}
      // inputValue={inputValue}
    />
  )
}

CurrencyList.propTypes = {}

export const AssetList = ({
  handleTransfer = () => {},
  options = [],
  placeholder = "",
  // defaultDataPoint = null,
}) => {
  return (
    <Select
      options={options}
      name="asset"
      theme={(theme) => themer(theme)}
      // defaultInputValue={defaultDataPoint}
      // styles={colourStyles}
      placeholder={placeholder}
      isClearable={true}
      onChange={handleTransfer}
    />
  )
}
