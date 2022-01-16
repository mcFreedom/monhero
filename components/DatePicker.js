import { useState } from "react"

import "react-dates/initialize"
import "react-dates/lib/css/_datepicker.css"
import moment from "moment"
import { SingleDatePicker } from "react-dates"
import PropTypes from "prop-types"

const renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => {
  // if (soon) return <strong>{month.format("MMMM YYYY")}</strong>
  const maxFutureYears = 0
  const yearsInThePast = 50
  const years = [...Array(yearsInThePast)]
    .map((_el, index) => {
      const year = moment().year() - index + maxFutureYears
      return (
        <option value={year} key={`year-${year}`}>
          {year}
        </option>
      )
    })
    .reverse()

  return (
    <div className="d-flex justify-content-center align-items-center LongTimeSelector">
      <select
        value={month.month()}
        onChange={(e) => onMonthSelect(month, e.target.value)}
      >
        {moment.months().map((label, value) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </select>
      <select
        value={month.year()}
        onChange={(e) => onYearSelect(month, e.target.value)}
      >
        {years}
      </select>
    </div>
  )
}

export const DatePicker = ({ date, onChange, id }) => {
  const [focused, setFocused] = useState(false)
  const futureDisabled = true
  const checkDay = (day) => {
    if (futureDisabled) return day > new Date()
    return false
  }

  return (
    <SingleDatePicker
      numberOfMonths={1}
      onDateChange={(date) => onChange(date)}
      onFocusChange={({ focused }) => setFocused(focused)}
      focused={focused}
      date={date}
      id={id}
      openDirection="up"
      displayFormat="DD-MM-YYYY"
      // isDayBlocked={(m) => m.day() === 6 || m.day() === 0}
      // hideKeyboardShortcutsPanel
      isOutsideRange={(date) => checkDay(date)}
      // enableOutsideDays
      // withPortal
      renderMonthElement={renderMonthElement}
      withFullScreenPortal={window.innerWidth < 400}
    />
  )
}

DatePicker.propTypes = {}
