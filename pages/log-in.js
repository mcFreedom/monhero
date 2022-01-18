import { useContext, useState } from "react"
import { UserbaseContext } from "../utils"
import userbase from "userbase-js"
import Head from "next/head"
import { FaExclamationTriangle, FaTimes } from "react-icons/fa"
import { useRouter } from "next/router"

export default function LogIn({ signUpProp = false }) {
  const router = useRouter()
  const [signUp, setSignUp] = useState(signUpProp)

  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [agreement, setAgreement] = useState("")
  const [explainerAccepted, setExplainerAccepted] = useState(false)
  const [passwordStrong, setPasswordStrong] = useState(2)
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

  const handleLoginInputChange = (event) => {
    if (event.target.name === "password" && signUp) analyze(event.target.value)
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value })
  }
  const resetPassword = () => setLoginForm({ ...loginForm, password: "" })

  const { user, setUser } = useContext(UserbaseContext)
  const handleLogout = () => {
    userbase
      .signOut()
      .then(() => {
        setUser(null)
        router.push === "/"
      })
      .catch((err) => {
        if (err === "UserAlreadySignedIn") router.push === "/"
        alert(err)
      })
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    if (loginForm.username && loginForm.password)
      userbase
        .signIn({
          username: loginForm.username,
          password: loginForm.password,
          rememberMe: "local",
        })
        .then((ur) => {
          setUser(ur)
          router.push === "/"
        })
        .catch((err) => {
          if (err === "UserAlreadySignedIn") router.push === "/"
          alert(err)
        })
  }
  const handleRegSubmit = (event) => {
    event.preventDefault()
    if (loginForm.username && loginForm.password && passwordStrong === 0)
      userbase
        .signUp({
          username: loginForm.username,
          password: loginForm.password,
          rememberMe: "local",
        })
        .then((ur) => {
          setUser(ur)
          router.push === "/"
        })
        .catch((err) => alert(err))
  }

  return (
    <div className="flex-center h-screen mt-10">
      <Head>
        <title>{signUp ? "Sign Up - MonHero" : "Log In - Monhero"}</title>
      </Head>
      {user ? (
        <div>
          Signed in as {user.username}.{" "}
          <button onClick={handleLogout}>Log out</button>
        </div>
      ) : (
        <div>
          {signUp && !explainerAccepted ? (
            <div className="flex flex-col w-full items-center max-w-500 bg-yellow-400 border-4 border-gray-600 p-5">
              <FaExclamationTriangle className="text-xl text-red-500" />
              <FaTimes
                className="text-xl text-gray-500 mr-0"
                onClick={() => setSignUp(false)}
              />
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
              <div className="flex w-full">
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
                    <label className="pr-2 font-bold">Password</label>
                    <input
                      className="border w-2/3 p-5 rounded"
                      type="password"
                      name="password"
                      value={loginForm?.password}
                      onChange={handleLoginInputChange}
                      placeholder="V3ryL0ng&s3cr3T!!!!"
                      clearable="true"
                    />

                    <FaTimes
                      className={`right-2 absolute text-gray-400 ${
                        loginForm.password.length > 0 ? "" : "hidden"
                      }`}
                      onClick={() => resetPassword()}
                    />
                  </div>
                  {signUp ? (
                    signUp &&
                    passwordStrong !== 0 && (
                      <>
                        <div className={`p-1 rounded ${pwBgColor()}`}>
                          This password is too weak. <br />
                          Lowercase, uppercase, symbol and number needed. <br />
                        </div>
                        )
                        <div className="border-4 bg-yellow-400 p-4 m-1">
                          Please use a password manager to save this. <br />
                          We cannot recover your password if you lose it.
                        </div>
                        <div className="text-xs my-5 mx-1">
                          By clicking the button, you also accept our{" "}
                          <a
                            className="a"
                            href="www.monhero.estate/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            terms and conditions
                          </a>
                        </div>
                      </>
                    )
                  ) : (
                    <></>
                  )}
                  <input
                    type="submit"
                    onClick={signUp ? handleRegSubmit : handleLoginSubmit}
                    value={signUp ? "Sign Up" : "Log In"}
                    className="btn cursor-pointer"
                  />
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
