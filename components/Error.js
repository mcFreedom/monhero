import { FaArrowLeft } from "react-icons/fa"
import { useRouter } from "next/router"

export const Error = () => {
  const router = useRouter()
  return (
    <div className="flex-center flex-col h-screen">
      <h2>Something went wrong</h2>
      <FaArrowLeft
        onClick={() => router.push("/")}
        className="text-2xl cursor-pointer my-5"
      />
      <div>Go home</div>
    </div>
  )
}

Error.propTypes = {}
