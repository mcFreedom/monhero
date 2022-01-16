import React, { useContext } from "react"
import { StoreContext } from "../../utils"

import { FaExclamationTriangle } from "react-icons/fa"

export const WelcomeModal = ({ shown = false, setIsShown = () => {} }) => {
  const { saveToCookie } = useContext(StoreContext)

  const getStarted = () => {
    saveToCookie("tutorialAccepted", new Date())
    setIsShown(false)
  }

  return shown ? (
    <div className="modal-style md:m-36 p-4 md:p-16 absolute top-10 left-0 right-0">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="flex-center w-full">
            <h5 className="text-2xl font-bold">Welcome!</h5>
          </div>

          <div className="flex-center flex-col">
            <div className="py-4">
              <strong>MonHero</strong> intends to help you make sense of your
              finances
            </div>
            <div>
              Enter all of your assets and see their value in any of our
              supported currencies (National, Precious Metal, Crypto)
            </div>
            <div className="py-4">
              To help you get started, we preloaded a few assets to show you
              what the app looks like once you have finished setting it up.
            </div>
            <div>Once you create an account, your own data will be loaded.</div>
            <div className="py-4">
              <FaExclamationTriangle className="inline text-yellow-500 mb-1 mr-1" />
              <span>
                We <strong>never</strong> have access to your financial data.
                The data is stored on a server but the connection is{" "}
                <strong>end-to-end encrypted</strong>. We{" "}
                <strong>do not snoop</strong>, and never will condone it.
              </span>
            </div>
            <div>
              The only data anyone could ever see are your username and email
              (if you choose to enter your email)
            </div>
            <div className="py-4">
              If you spot any bugs, please let us know at
              <href mailto="hello@monhero.estate" className="a">
                {" "}
                hello@monhero.estate
              </href>
            </div>
            <button onClick={() => getStarted()} className="btn mb-2">
              Let&apos;s get started
            </button>
          
          </div>
        </div>
      </div>
    </div>
  ) : null
}
