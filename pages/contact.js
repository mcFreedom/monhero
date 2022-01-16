import Link from "next/link"

const Contact = () => {
  return (
    <div className="flex-center flex-col min-h-screen pt-10 md:pt-40 w-full md:w-3/5 mx-auto">
      <h1>Contact</h1>
      <a href="mailto:hello@monhero.estate" className="a">
        Email us
      </a>
    </div>
  )
}

export default Contact
