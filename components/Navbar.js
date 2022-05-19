import { useContext, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { FaBars, FaCog, FaPlus, FaTimes, FaUser } from "react-icons/fa"

import { useVisibility, useTotalAmounts, useRate } from "../utils/hooks"
import { FaSpinner } from "react-icons/fa"
import { StoreContext } from "../utils"

import { CurrencyPicker, WarningBar } from "../components"
import { RateContext } from "../utils"
import moment from "moment"

export const Navbar = ({
  styleOnly = false,
  warning = false,
  setShowModal = () => {},
}) => {
  const { rates, error, getData } = useContext(RateContext)
  const [timeAgo, setTimeAgo] = useState("A while back")
  const [mobileMenu, setMobileMenu] = useState(false)
  const router = useRouter()
  const path = router.pathname

  useEffect(() => {
    let interval = null
    interval = setInterval(() => {
      if (rates && rates["lastUpdated"]) {
        setTimeAgo(moment(rates["lastUpdated"]).fromNow())
      } else {
        setTimeAgo("A while back")
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [rates])

  if (styleOnly === true) {
    return (
      <div className="w-screen border-b flex items-center justify-between fixed top-0 bg-white md:text-lg z-10">
        <div className="flex items-center">
          <Link href={"/assets"} passHref>
            <div
              className={
                "text-2xl px-2 font-extrabold cursor-pointer relative flex items-center"
              }
            >
              Secret Assets
              <div className="bg-red-500 text-white text-xs p-1 rounded rotate-12 mt-1 ml-1">
                beta
              </div>
            </div>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col top-0">
      <div className="bw-screen border-b flex items-center justify-between bg-white  md:text-lg z-10 w-screen">
        <div className="flex items-center">
          <Link href={"/assets"} passHref>
            <div
              className={
                "text-2xl px-2 font-extrabold cursor-pointer relative flex items-center"
              }
            >
              Secret Assets
              <div className="bg-red-500 text-white text-xs p-1 rounded rotate-12 mt-1 ml-1">
                beta
              </div>
            </div>
          </Link>
          <div className="hidden md:block">
            <Navigation />
          </div>
        </div>
        <div className="md:hidden pr-5">
          {mobileMenu ? (
            <FaTimes onClick={() => setMobileMenu(false)} />
          ) : (
            <FaBars onClick={() => setMobileMenu(true)} />
          )}
          {mobileMenu ? (
            <div className="flex justify-center items-end flex-col absolute mt-2   ton  bg-white right-0 w-screen px-5  border-b">
              <Navigation path={path} />
              <MenuOptions
                error={error}
                showModal={setShowModal}
                timeAgo={timeAgo}
                fetchData={getData}
              />{" "}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="right-end px-2 hidden md:flex md:justify-end md:items-center">
          <MenuOptions
            error={error}
            showModal={setShowModal}
            timeAgo={timeAgo}
            getData={getData}
          />
        </div>
      </div>
      {warning ? <WarningBar setShowModal={setShowModal} /> : <></>}
    </div>
  )
}

const MenuOptions = ({ error, timeAgo, showModal, getData }) => {
  return (
    <>
      {error ? (
        <span className="text-xs text-gray-500 pr-2 hidden md:block h-10 text-right md:min-w-1/2">{`Last ${error}`}</span>
      ) : null}
      <span
        className="text-xs text-gray-500 h-10 flex items-center cursor-pointer"
        onClick={() => getData()}
      >
        {`Last rate update: ${timeAgo}`}
      </span>
      <div className="h-10 md:px-2 flex items-center">
        <CurrencyPicker />
      </div>
      <div className="flex items-center md:px-2" onClick={showModal}>
        <FaUser className="cursor-pointer h-10" />
        <span className="md:hidden pl-1">Profile</span>
      </div>
      <Link href={"/settings"} passHref>
        <div className="flex justify-end items-center">
          <FaCog className="cursor-pointer h-10 text-lg" />
          <span className="md:hidden pl-1">Settings</span>
        </div>
      </Link>
    </>
  )
}

const Navigation = ({ path }) => {
  const { totalDisplayed } = useVisibility()
  const { totalForAssets } = useTotalAmounts()
  const {
    state: { currency, assets },
  } = useContext(StoreContext)
  const { loading } = useRate()

  return (
    <div className="flex flex-col md:flex-row md:items-center text-right md:row divide-x-1/2">
      <Link href={"/assets"} passHref>
        <div
          className={`${
            path === "portfolio" ? "font-extrabold" : ""
          } md:px-2 my-2 md:my-0 cursor-pointer h-10 md:h-initial md:pr-5 hover:bg-gray-300`}
        >
          Assets
          <div className="text-gray-600">
            {loading ? (
              <FaSpinner className="fa-spin" />
            ) : totalDisplayed ? (
              `${totalForAssets(
                assets.filter((a) => !a.item.liability).map((a) => a.item),
                false,
                false,
                false,
              )}`
            ) : (
              `****${currency}`
            )}
          </div>
        </div>
      </Link>
      <Link href={"/liabilities"} passHref>
        <div
          className={`${
            path === "/liabilities" ? "font-extrabold bg-grey-200" : ""
          } md:px-2 my-2 md:my-0 cursor-pointer h-10 md:h-initial md:pr-5 hover:bg-gray-300`}
        >
          Liabilities
          <div className="text-gray-600">
            {loading ? (
              <FaSpinner className="fa-spin" />
            ) : totalDisplayed ? (
              `${totalForAssets(
                assets.filter((a) => a.item.liability).map((a) => a.item),
                false,
                false,
                false,
              )}`
            ) : (
              `****${currency}`
            )}
          </div>
        </div>
      </Link>
      <Link href={"/portfolio"} passHref>
        <div
          className={`${
            path === "/portfolio" ? "font-extrabold bg-grey-200" : ""
          } md:px-2 my-2 md:my-0 cursor-pointer h-10 md:h-initial hover:bg-gray-300`}
        >
          Net Worth
          <div className="text-gray-600">
            {loading ? (
              <FaSpinner className="fa-spin" />
            ) : totalDisplayed ? (
              `${totalForAssets(
                assets.map((a) => a.item),
                false,
                false,
                true,
              )}`
            ) : (
              `****${currency}`
            )}
          </div>
        </div>
      </Link>
      <Link href="/new-asset" passHref>
        <button className="btn small nav-bar my-2 md:my-1 h-10 md:h-initial flex-center ml-2">
          <FaPlus className="pr-1" />
          Add
        </button>
      </Link>
    </div>
  )
}
