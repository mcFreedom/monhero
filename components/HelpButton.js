import React, { useState } from "react"
import { FaTimes } from "react-icons/fa"

export const HelpButton = () => {
  const [open, setOpen] = useState(false)
  return open ? (
    <div className="hidden md:flex md:items-end md:flex-col border p-5 absolute bottom-5 right-5 rounded bg-white">
      <FaTimes
        onClick={() => setOpen(false)}
        className="cursor-pointer right-0 mb-2 text-gray-600"
      />
      <div className="flex flex-col text-right">
        For any issue
        <a href="mailto:hello@secassets.com" className="a">
          Email us
        </a>
        hello@secassets.com
      </div>
    </div>
  ) : (
    <div
      className="rounded-full border px-4 p-2 bottom-5 right-5 hidden md:block cursor-pointer bg-white fixed"
      onClick={() => setOpen(true)}
    >
      ?
    </div>
  )
}

HelpButton.propTypes = {}
