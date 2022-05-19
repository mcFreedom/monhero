import { useState, useEffect, useContext } from "react"
import "../styles/globals.css"
import "../styles/tailwind.css"
import {
  StoreProvider,
  RateProvider,
  StoreContext,
  UserbaseProvider,
} from "../utils"
import { assetMethods } from "../utils"
import { Navbar, HelpButton } from "../components"
import { WelcomeModal } from "../components/portal"
import { UserModal } from "../components/portal/UserModal"

const { getAssetCurrencies } = assetMethods
import Head from "next/head"
import { useRouter } from "next/router"
import LogIn from "./log-in"

function MyApp({ Component, pageProps }) {
  const [showModal, setShowModal] = useState(true)
  return (
    <UserbaseProvider>
      <Store setShowModal={setShowModal}>
        <ChildApp
          showModal={showModal}
          setShowModal={setShowModal}
          pageProps={pageProps}
        >
          <Component {...pageProps} />
        </ChildApp>
      </Store>
    </UserbaseProvider>
  )
}

export default MyApp

const ChildApp = ({ showModal, setShowModal, children }) => {
  const router = useRouter()
  const { user } = useContext(StoreContext)
  const [userValid, setUserValid] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  useEffect(() => {
    const accepted = window.localStorage.getItem("termsAccepted")
    setTermsAccepted(JSON.parse(accepted) ? true : false)
  }, [])
  useEffect(() => {
    setUserValid(user ? true : false)
  }, [user])

  const demoMode = router.asPath === "/demo"
  const signUp = router.asPath === "/sign-up"
  return !demoMode && !user ? (
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
        <div>
          <Navbar setShowModal={setShowModal} warning={!userValid} />
        </div>
        <div className="min-h-screen">
          {children}
          <UserModal
            shown={demoMode ? false : showModal}
            setIsShown={setShowModal}
          />
          {!termsAccepted && <WelcomeModal />}
          <HelpButton />
        </div>
      </Rate>
    </>
  )
}

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

const Store = ({ children, setShowModal }) => {
  return <StoreProvider setShowModal={setShowModal}>{children}</StoreProvider>
}
