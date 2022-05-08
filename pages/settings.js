import { useContext } from "react"
import { Toggle } from "../components"
import { StoreContext, constants } from "../utils"
import Link from "next/link"
import Image from "next/image"
const { CATEGORIES } = constants
import { FaHome } from "react-icons/fa"
import Head from "next/head"

export default function Settings() {
  const {
    state: { categories },
    // dispatch,
    // resetState,
    dbAction,
  } = useContext(StoreContext)

  const toggleCategory = (item, id) => {
    let category = { ...item }
    category.enabled = !category.enabled
    dbAction("update", "categories", category, id)
  }
  // const setState = (stateValue) => resetState(stateValue)

  return (
    <div className="bg-gray-300 top-0 absolute w-full min-h-screen">
      <Head>
        <title>Settings</title>
      </Head>
      <div className="bg-white rounded md:w-1/2 mx-auto p-5 my-20 ">
        <div className="flex items-center justify-between w-full">
          <div className="cursor-pointer">
            <Link href="/" passHref>
              <FaHome className="self-start" />
            </Link>
          </div>
          <h5 className="text-2xl font-bold p-4">Settings</h5>
          <div> </div>
        </div>
        <hr />
        <div className="flex-col flex-center p-4">
          <h5 className="text-xl font-bold p-4">Categories</h5>
          {categories.map((cat, index) => {
            const { item: category, itemId: id } = cat
            return (
              <div key={index} className="flex py-1 relative">
                <span>{CATEGORIES[category?.name]}</span>
                <Toggle
                  value={category.enabled}
                  toggle={() => {
                    // BLOCKED_CATEGORIES.includes(category?.name)
                    //   ? () => {}
                    //   :
                    toggleCategory(category, id)
                  }}
                />
                {/* {BLOCKED_CATEGORIES.includes(category?.name) ? (
                  <span className="notice -top-1">Coming soon</span>
                ) : (
                  <></>
                )} */}
              </div>
            )
          })}
        </div>
        <hr />
        <div className="flex-col flex-center p-4 text-justify md:w-1/2 mx-auto">
          <h5 className="text-xl font-bold p-4">Privacy</h5>
          <div>
            Your asset data never leaves this browser. It is encrypted so that
            no overly-curious snoop can come and look into it.
          </div>
          <div>
            <strong>Legal: </strong>
            <div>If someone breaks encryption, we are not responsible!</div>
          </div>
        </div>
        <hr />
        <div className="flex-col flex-center p-4">
          <h5 className="text-xl font-bold p-4">Inheritance Planning</h5>
          <div className="card cursor-not-allowed">
            <Link href="#" disabled>
              <div>Inheritance simulator</div>
            </Link>
            <div className="notice mt-4">Coming soon</div>
          </div>
        </div>
        <hr />
        <div className="flex-col flex-center p-4">
          <h5 className="text-xl font-bold p-4">Tab title</h5>
          <div className="card cursor-not-allowed">
            <Link href="#" disabled>
              <div>Pick the data to display in the tab bar:</div>
            </Link>
            <div className="notice mt-4">Coming soon</div>
          </div>
        </div>
        <hr />

        <div className="flex-col flex-center p-4">
          <h5 className="text-xl font-bold p-4">Change data</h5>
          <div className="w-full flex-center flex-wrap">
            {/* TODO bring back */}
            {/* <div
              id="card"
              className="card m-5 cursor-pointer"
              onClick={() => setState("example")}
            >
              <div className="text-center">Example state</div>
            </div>
            <div
              id="card"
              className="card m-5 cursor-pointer"
              onClick={() => setState("blank")}
            >
              <div className="text-center">Blank State</div>
            </div> */}
            <div
              id="card"
              className="card m-5 cursor-not-allowed"
              onClick={() => {}}
            >
              <Image
                src="/bezos_profile.png"
                className="rounded-xl"
                width={75}
                height={75}
              />
              <div className="text-center ml-2">Jeff Bezos&apos; assets</div>
              <div className="notice mt-8">Coming soon</div>
            </div>
            <div
              id="card"
              className="card m-5 cursor-not-allowed"
              onClick={() => {}}
            >
              <Image
                src="/musk.jpeg"
                className="rounded-xl"
                width={75}
                height={75}
              />
              <div className="text-center ml-2">Elon Musk&apos;s assets</div>
              <div className="notice mt-8">Coming soon</div>
            </div>
          </div>
        </div>

        <div className="flex-col flex-center p-4">
          <h5 className="text-xl font-bold p-4"></h5>
          <div className="card cursor-not-allowed">
            Made with ❤️, somewhere on Earth. Thanks to Coingecko for their
            crypto data.
          </div>
        </div>
      </div>
    </div>
  )
}
