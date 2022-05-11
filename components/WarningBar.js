import { forwardRef } from "react"
import PropTypes from "prop-types"
// import { useRouter } from "next/router"

export const WarningBar = forwardRef(({ setShowModal }, ref) => {
  // const router = useRouter()
  // const path = router.pathname
  // const home = path === "/"

  return (
    <div
      ref={ref}
      className="w-screen bg-red-500 text-center text-white z-10 text-xs md:text-lg top-3 block
      "
    >
      Try navigating the app to experience the flow as a user who has filled in
      their data.
      <a
        className="font-bold hover:underline px-1 cursor-pointer"
        onClick={setShowModal}
      >
        Create an account
      </a>
      or
      <a
        className="font-bold hover:underline px-1 cursor-pointer"
        onClick={setShowModal}
      >
        login
      </a>
      to manage your own data.
    </div>
  )
})

WarningBar.propTypes = {
  shown: PropTypes.func,
}

WarningBar.displayName = "WarningBar"
