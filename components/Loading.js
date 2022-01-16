import { FaSpinner } from "react-icons/fa"

export const Loading = ({ fullPage = false }) => {
  return (
    <div className={`flex-center flex-col ${fullPage ? "h-screen" : "h-full"}`}>
      <FaSpinner className="text-2xl cursor-pointer my-5 fa-spin" />
      {fullPage && (
        <div>Loading. Decrypting. Keeping you safe from prying eyes 👀</div>
      )}
    </div>
  )
}

export const Loader = () => {
  return (
    <div className="flex justify-end">
      <FaSpinner className="fa-spin" />
    </div>
  )
}

Loading.propTypes = {}
