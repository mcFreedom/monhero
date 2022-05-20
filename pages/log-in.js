import { useContext, useState, useEffect, useCallback } from "react"
import { UserbaseContext } from "../utils"
import Head from "next/head"
import {
  FaExclamationTriangle,
  FaTimes,
  FaSpinner,
  FaEye,
} from "react-icons/fa"

export default function LogIn({ signUpProp = false }) {
  return <LogInComponent signUpProp={signUpProp} />
}

export function LogInComponent({ signUpProp = false }) {
  const [signUp, setSignUp] = useState(signUpProp)

  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [agreement, setAgreement] = useState("")
  // const [loading, setLoading] = useState(false)
  const [explainerAccepted, setExplainerAccepted] = useState(false)
  const [passwordStrong, setPasswordStrong] = useState(2)
  const [visiblePassword, setVisiblePassword] = useState(false)
  const strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})",
  )
  const mediumRegex = new RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})",
  )
  const pwBgColor = () => {
    if (passwordStrong == 0) return "bg-green-500"
    if (passwordStrong == 1) return "bg-yellow-500"
    return "bg-red-500"
  }
  const analyze = (pw) => {
    if (strongRegex.test(pw)) {
      setPasswordStrong(0) //strong
    } else if (mediumRegex.test(pw)) {
      setPasswordStrong(1) //med
    } else {
      setPasswordStrong(2) // weak
    }
  }

  const listenToSubmit = useCallback((event) => {
    if (event.code === "Enter") {
      signUp ? handleRegSubmit() : handleLoginSubmit()
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", listenToSubmit, false)
    return () => {
      document.removeEventListener("keydown", listenToSubmit, false)
    }
  }, [])

  const handleLoginInputChange = (event) => {
    if (event?.target.name === "password" && signUp) analyze(event.target.value)
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value })
  }
  const resetPassword = () => setLoginForm({ ...loginForm, password: "" })

  const { user, userMethod, loading } = useContext(UserbaseContext)

  const handleLogout = () => {
    userMethod("signOut")
  }

  const handleLoginSubmit = (event) => {
    event?.preventDefault()
    if (loginForm.username && loginForm.password)
      userMethod("signIn", {
        username: loginForm.username,
        password: loginForm.password,
        rememberMe: "local",
      })
  }
  const handleRegSubmit = (event) => {
    event?.preventDefault()
    if (loginForm.username && loginForm.password && passwordStrong === 0)
      userMethod("signUp", {
        username: loginForm.username,
        password: loginForm.password,
        rememberMe: "local",
      })
  }

  return (
    <div className="flex-center mt-10 px-30">
      <Head>
        <title>
          {signUp ? "Sign Up - Secret Assets" : "Log In - Secret Assets"}
        </title>
      </Head>
      {user ? (
        <div className="flex flex-col">
          <span>
            Signed in as <strong>{user.username}. </strong>
          </span>
          <button onClick={handleLogout} className="btn danger">
            Log out
          </button>
        </div>
      ) : (
        <div>
          {signUp && !explainerAccepted ? (
            <div className="flex flex-col w-full items-center max-w-500 bg-yellow-400 border-4 border-gray-600 p-5">
              <div className="flex w-full justify-end">
                <FaTimes
                  className="text-xl text-gray-500 mr-0 right-0 cursor-pointer"
                  onClick={() => setSignUp(false)}
                />
              </div>
              <FaExclamationTriangle className="text-xl text-red-500" />
              This is an end-to-end encrypted app. <br />
              We want to know as little as we can about you, therefore, as you
              sign up:
              <br />
              1. Do not use an email as an identifier
              <br />
              2. Use a very strong gibberish password that you will only use on
              this website.
              <br />
              3. Use a password manager to save it, we cannot retrieve your
              password
              <br />
              <span className="text-center  py-1 text-lg">
                Type &quot;<strong>I understand</strong>&quot;
              </span>
              <input
                className="rounded p-5"
                onChange={(e) => setAgreement(e.target.value)}
                placeholder="I understand"
              />
              <button
                className={`btn cursor-pointer ${
                  agreement === "I understand" ? "" : "disabled"
                }`}
                onClick={() => setExplainerAccepted(true)}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <>
              <div className="flex w-full ">
                <button
                  className={`btn cursor-pointer ${signUp ? "disabled" : ""}`}
                  onClick={() => setSignUp(true)}
                >
                  Sign Up
                </button>
                <button
                  className={`btn cursor-pointer ${signUp ? "" : "disabled"}`}
                  onClick={() => setSignUp(false)}
                >
                  Log in
                </button>
              </div>
              <div className="flex flex-col w-full items-center max-w-500">
                <h2>{signUp ? "Sign Up" : "Log In"}</h2>
                <form
                  onSubmit={signUp ? handleRegSubmit : handleLoginSubmit}
                  className="flex flex-col mx-1"
                >
                  <div className="w-100 flex justify-end items-center">
                    <label className="pr-2 font-bold">Username</label>
                    <input
                      className="border w-2/3 p-5 rounded"
                      type="text"
                      name="username"
                      value={loginForm?.username}
                      onChange={handleLoginInputChange}
                      placeholder="Dread Pirate Roberts"
                    />
                  </div>

                  <div className="w-100 flex justify-end items-center my-2 relative">
                    <div className="flex flex-col items-end">
                      <label className="pr-2 font-bold">Password</label>
                      <FaEye
                        onClick={() => setVisiblePassword(!visiblePassword)}
                        className="text-gray-400 cursor-pointer mr-2"
                      />
                    </div>
                    <input
                      className="border w-2/3 p-5 rounded"
                      type={visiblePassword ? "text" : "password"}
                      name="password"
                      value={loginForm?.password}
                      onChange={handleLoginInputChange}
                      placeholder="V3ryL0ng&s3cr3T!!!!"
                      clearable="true"
                    />

                    <FaTimes
                      className={`right-2 absolute text-gray-400 cursor-pointer ${
                        loginForm.password?.length > 0 ? "" : "hidden"
                      }`}
                      onClick={() => resetPassword()}
                    />
                  </div>
                  {signUp ? (
                    signUp &&
                    loginForm?.password?.length > 0 &&
                    passwordStrong !== 0 && (
                      <>
                        <div
                          className={`rounded ${pwBgColor()} border-4 border-red-400 p-4 m-1`}
                        >
                          <p>This password is too weak.</p>
                          <p className="block">
                            Lowercase, uppercase, symbol and number needed.
                          </p>
                          <p className="block">8 characters minimum</p>
                        </div>
                      </>
                    )
                  ) : (
                    <></>
                  )}
                  {signUp ? (
                    <>
                      <div className="border-4 bg-yellow-400 p-4 m-1">
                        Please use a password manager to save this. <br />
                        We cannot recover your password if you lose it.
                      </div>
                      <div className="text-xs my-5 mx-1">
                        By clicking the button, you also accept our{" "}
                        <a
                          className="a"
                          href={`${process.env.NEXT_PUBLIC_MARKETING_URL}/terms`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          terms and conditions
                        </a>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {loading ? (
                    <div className="btn flex items-center">
                      <FaSpinner className="text-xl animate-spin" />
                      <span className="pl-2">Decrypting...</span>
                    </div>
                  ) : (
                    <input
                      type="submit"
                      onClick={signUp ? handleRegSubmit : handleLoginSubmit}
                      value={signUp ? "Sign Up" : "Log In"}
                      className="btn cursor-pointer"
                    />
                  )}
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

LogIn.propTypes = {}
