import { FaTimes } from "react-icons/fa"
import { LogInComponent } from "../../pages/log-in"

export const UserModal = ({ shown = false, setIsShown = () => {} }) => {
  return shown ? (
    <div className="modal-style md:m-36 p-4 md:p-16 absolute top-10 left-0 right-0 z-30">
      <div className="flex-center flex-col w-full p-10">
        <div className=" w-full flex justify-end">
          <FaTimes
            onClick={() => setIsShown(false)}
            className="cursor-pointer text-lg m-3 justify-right"
          />
        </div>
        <LogInComponent />
      </div>
    </div>
  ) : null
}
