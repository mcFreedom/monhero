import React, { useContext, useState } from "react"
import { StoreContext, UserbaseContext } from "../../utils"
import { FaSpinner, FaTimes } from "react-icons/fa"
import { useRouter } from "next/router"

export const UserModal = ({ shown = false, setIsShown = () => {} }) => {
  const router = useRouter()
  const { userMethod, error, loading, user } = useContext(UserbaseContext)
  const { error: storeError } = useContext(StoreContext)

  const [logIn, setLogIn] = useState(true)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })

  const handleInputChange = (event) =>
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value })

  const handleLogout = () => {
    userMethod("signOut")

    router.push("/")
  }
  const handleSubmit = (event) => {
    // TODO: handle remmeber me
    // rememberMe [string | optional] - The persistence mode for the user's session. Valid values are 'local', 'session', and 'none'. When set to 'local', the session persists even after the browser window gets closed. When set to 'session', the session persists until the browser window gets closed. And 'none' disables session persistence completely. Defaults to 'session'.
    event.preventDefault()
    if (loginForm.username?.length > 1 && loginForm.password?.length > 1) {
      const params = {
        username: loginForm.username,
        password: loginForm.password,
        rememberMe: "local",
      }
      const method = logIn ? "signIn" : "signUp"
      userMethod(method, params)
    }
  }

  return shown ? (
    <div className="modal-style md:m-36 p-4 md:p-16 absolute top-10 left-0 right-0 z-30">
      <div className="flex-center flex-col w-full p-10">
        <div className=" w-full flex justify-end">
          <FaTimes
            onClick={() => setIsShown(false)}
            className="cursor-pointer text-lg m-3 justify-right"
          />
        </div>
        {user ? (
          <SignOut handleLogout={handleLogout} user={user} />
        ) : (
          <div>
            <span>{logIn ? "No account?" : "Already have an account?"}</span>

            <button className="btn m-0 ml-2" onClick={() => setLogIn(!logIn)}>
              {logIn ? "Sign up" : "Log In"}
            </button>
          </div>
        )}
      </div>
      {storeError ? (
        <div className="flex-center font-bold text-red-500">{storeError}</div>
      ) : null}
      {!user && (
        <LogIn
          loginForm={loginForm}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          logIn={logIn}
          error={error}
          loading={loading}
        />
      )}
    </div>
  ) : null
}

const SignOut = ({ user, handleLogout }) => {
  return (
    <div className="flex-center flex-col">
      <div>
        You are logged in as <strong>{user?.username}</strong>
      </div>
      <button className="btn danger" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  )
}

const LogIn = ({
  loginForm,
  handleInputChange,
  handleSubmit,
  logIn,
  error,
  loading,
}) => {
  const disabled =
    loginForm.username?.length < 1 || loginForm.password?.length < 1
  return (
    <div className="flex-center flex-col =p-3">
      <div className="flex-center flex-col">
        <h2>{logIn ? "Log In" : "Sign Up"}</h2>
        {logIn ? null : (
          <small>
            Data is end to end encrypted and we cannot help you retrieve it if
            you become unable to log in.
          </small>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="flex flex-col">
            Username:
            <input
              type="text"
              name="username"
              placeholder="Melon Husk"
              value={loginForm?.username}
              onChange={handleInputChange}
              className="border p-2"
              autoComplete="email"
            />
          </label>

          <label className="flex flex-col mt-2">
            Password:
            <input
              type="password"
              name="password"
              placeholder="SekreT!"
              value={loginForm?.password}
              onChange={handleInputChange}
              className="border p-2"
              autoComplete={logIn ? "current-password" : "new-password"}
            />
          </label>
          {error ? <div className="text-red-500 font-bold">{error}</div> : null}
          {loading ? (
            <button className="btn px-5">
              <FaSpinner className="fa-spin" />
            </button>
          ) : (
            <input
              type="submit"
              value={logIn ? "Log In" : "Sign Up"}
              className={`btn ${disabled ? "disabled" : ""}`}
              disabled={disabled}
            />
          )}
        </form>
      </div>
    </div>
  )
}

LogIn.propTypes = {}
