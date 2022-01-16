import { useState, useEffect } from "react"
import "../styles/globals.css"
import "../styles/tailwind.css"
import {
  StoreProvider,
  RateProvider,
  StoreContext,
  UserbaseProvider,
  UserbaseContext,
} from "../utils"
import { useContext } from "react"
import { helpers, assetMethods } from "../utils"
import { Navbar, WarningBar, HelpButton } from "../components"
import Head from "next/head"
import { UserModal } from "../components/portal/UserModal"
const { retrieveLocalStorage } = helpers
const { getAssetCurrencies } = assetMethods
import { useRouter } from "next/router"
import LogIn from "./log-in"

function MyApp({ Component, pageProps, href }) {
  const router = useRouter()
  useEffect(() => {
    retrieveLocalStorage("tutorialAccepted").then((value) => {
      setShowModal(value?.length > 0)
    })
  }, [])
  const demoMode = router.asPath === "/demo"
  const signUp = router.asPath === "/sign-up"
  const [showModal, setShowModal] = useState(true)
  const [userPresent, setUserPresent] = useState(false)
  console.log({ userPresent })

  return (
    <UserbaseProvider>
      <Store setShowModal={setShowModal} setUserPresent={setUserPresent}>
        {!demoMode && userPresent === false ? (
          <>
            <Navbar styleOnly />
            <LogIn signUpProp={signUp} />
          </>
        ) : (
          <>
            <Head>
              <link rel="icon" href="/favicon.ico" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
              />
            </Head>
            <Rate>
              <Navbar showModal={setShowModal} />
              <div className="h-full min-h-screen">
                {demoMode ? <WarningBar setShowModal={setShowModal} /> : <></>}
                <Component {...pageProps} />
                <UserModal
                  shown={demoMode ? false : showModal}
                  setIsShown={setShowModal}
                />
                <HelpButton />
              </div>
            </Rate>
          </>
        )}
      </Store>
    </UserbaseProvider>
  )
}

export default MyApp

const Rate = ({ children }) => {
  const {
    state: { currency, assets },
  } = useContext(StoreContext)
  const to = getAssetCurrencies([
    { currency: "btc" },
    ...assets.map((a) => a.item),
  ])
  return (
    <RateProvider to={to} currency={currency.toLowerCase()}>
      {children}
    </RateProvider>
  )
}
const Store = ({ children, setShowModal, setUserPresent }) => {
  const { user, databases, setDatabases } = useContext(UserbaseContext)
  useEffect(() => {
    if (user) {
      setShowModal(false)
      setUserPresent(true)
    }
  }, [user])
  return (
    <StoreProvider
      user={user}
      databases={databases}
      setDatabases={setDatabases}
      setShowModal={setShowModal}
    >
      {children}
    </StoreProvider>
  )
}
