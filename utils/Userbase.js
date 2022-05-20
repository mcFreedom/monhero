import React, { createContext, useEffect, useState } from "react"

import { loadStripe } from "@stripe/stripe-js/pure"

import userbase from "userbase-js"
import { constants } from "./constants"
const { exampleState } = constants
import { useRouter } from "next/router"

const appId = process.env.NEXT_PUBLIC_USERBASE_APP_ID

export const UserbaseContext = createContext({
  user: {},
  setUser: () => {},
  loading: false,
  error: "",
})

export const UserbaseProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [databases, setDatabases] = useState(null)
  const router = useRouter()

  useEffect(() => {
    userbase
      .init({ appId })
      .then((session) => {
        if (session.user) setUser(session.user)
      })
      .catch((err) => errorHandling(err))
  }, [])

  const getDatabases = () => {
    userbase
      .getDatabases()
      .then((arrayDb) => {
        //eg:  [{"databaseName": "institutions"}, {"databaseName": "categories"}]
        setDatabases(arrayDb.databases)
      })
      .catch((err) => errorHandling(err))
  }
  useEffect(() => {
    if (user) getDatabases()
  }, [user])

  const setUpDB = (databaseName = null, toAdd = null) => {
    const operations = toAdd.map((itemObject) => {
      const { item } = itemObject
      return { command: "Insert", item }
    })
    userbase
      .putTransaction({
        databaseName,
        operations,
      })
      .then(() => {
        getDatabases()
      })
      .catch((e) => errorHandling(e))
  }
  const createDB = (databaseName) => {
    userbase
      .openDatabase({
        databaseName,
        changeHandler: () => {},
      })
      .then(() => {
        if (databaseName === "categories") {
          console.log("seeding categories")
          setUpDB("categories", exampleState["categories"])
        }
      })
      .catch((e) => errorHandling(e))
  }
  const createAllDBs = () => {
    const requiredDatabases = ["categories", "assets", "institutions"]
    requiredDatabases.map((c) => createDB(c))
  }

  const userMethod = (method = null, params = null) => {
    if (["signOut", "signIn", "signUp"].includes(method)) setLoading(true)
    if (method === "signOut") {
      userbase
        .signOut()
        .then(() => {
          setLoading(false)
          setDatabases(null)
          router.push(process.env.NEXT_PUBLIC_MARKETING_URL)
        })
        .catch((err) => {
          setUser(null)
          setLoading(false)
          setDatabases(null)
          errorHandling(err)
        })
    }
    if (method === "signIn") {
      userbase
        .signIn(params)
        .then((ur) => {
          setUser(ur)
          setLoading(false)
        })
        .catch((err) => errorHandling(err))
    }
    if (method === "signUp") {
      userbase
        .signUp(params)
        .then((ur) => {
          setUser(ur)
          setLoading(false)
          createAllDBs()
        })
        .catch((err) => errorHandling(err))
    }
  }

  const loadStripeWhenNeeded = async () => {
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
    return stripe
  }

  const errorHandling = (err) => {
    setError(err.message)
    console.log({ err })
    setLoading(false)
    return
  }
  const userHasPaid = () => {
    // console.log({ toBeCancelled: user.cancelSubscriptionAt })
    return user.subscriptionStatus === "active"
  }
  const goToStripeCheckout = (currentUrl) => {
    loadStripeWhenNeeded().then(() => {
      userbase
        .purchaseSubscription({
          successUrl: `${process.env.NEXT_PUBLIC_APP_URL}${currentUrl}#success`,
          cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}${currentUrl}#fail`,
          priceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_ID,
        })
        .then(() => {
          console.log("striped")
        })
        .catch((e) => console.error(e))
    })
  }
  const cancelStripe = () => {
    userbase
      .cancelSubscription()
      .then((result) => {
        console.log({ result })
      })
      .catch((e) => console.error(e))
  }

  const resumeStripe = () => {
    userbase
      .resumeSubscription()
      .then(() => {
        // user sucessfully resumed subscription
      })
      .catch((e) => console.error(e))
  }

  const context = {
    user,
    databases,
    userMethod,
    loading,
    error,
    userHasPaid,
    goToStripeCheckout,
    cancelStripe,
    resumeStripe,
  }

  return (
    <UserbaseContext.Provider value={context}>
      {/* I usually do this for extra flexibility */}
      {typeof children === "function" ? children(context) : children}
    </UserbaseContext.Provider>
  )
}

// UserbaseProvider.propTypes = {
//   children: PropTypes.node.isRequired,
//   currency: PropTypes.string,
//   to: PropTypes.arrayOf(PropTypes.string),
// }
