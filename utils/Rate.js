import React, { createContext, useEffect, useState, useCallback } from "react"
import { PropTypes } from "prop-types"
import axios from "axios"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const RateContext = createContext({
  value: {},
  loading: true,
  error: "",
})

export const retrieveData = async () => {
  try {
    const value = await localStorage.getItem("rates")
    if (value !== null) {
      return JSON.parse(value)
    }
  } catch (error) {
    return {}
  }
}

const saveData = async (data) => {
  await localStorage.setItem("rates", JSON.stringify(data))
}

export const RateProvider = ({ children, currency = "usd", to = [] }) => {
  const [rates, setRates] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [seconds, setSeconds] = useState(0)

  const toCurrencies = to.join(",")
  const getData = useCallback(async () => {
    if (toCurrencies !== "") {
      await axios(`${BACKEND_URL}/rate?from=${currency}&to=${toCurrencies}`)
        .then((response) => {
          if (response.data) {
            const data = response.data || {}
            data["lastUpdated"] = new Date()
            setRates(data)
            saveData(data)
          }
        })
        .catch((error) => {
          console.error("Error fetching data: ", error)
          setError(error.message)
          setLoading(false)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [currency, toCurrencies])

  useEffect(() => {
    retrieveData().then((retrievedState) => {
      setRates(retrievedState)
    })
  }, [])

  // TODO: bring back auto refresh
  // useEffect(() => {
  //   let interval = null
  //   if (seconds > 1 && seconds % 300 === 0) {
  //     getData()
  //     console.log("$")
  //   }
  //   interval = setInterval(() => {
  //     setSeconds((seconds) => seconds + 10)
  //   }, 10000)

  //   return () => clearInterval(interval)
  // }, [seconds, getData])

  useEffect(() => {
    if (to.length > 0) {
      setLoading(true)
      getData()
    }
  }, [currency, getData])

  const context = {
    rates,
    loading,
    error,
  }
  return (
    <RateContext.Provider value={context}>
      {/* I usually do this for extra flexibility */}
      {typeof children === "function" ? children(context) : children}
    </RateContext.Provider>
  )
}

RateProvider.propTypes = {
  children: PropTypes.node.isRequired,
  currency: PropTypes.string,
  to: PropTypes.arrayOf(PropTypes.string),
}
