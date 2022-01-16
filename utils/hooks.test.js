import { renderHook, act } from "@testing-library/react-hooks"
import { useRate } from "./hooks"

describe("Rate shows up", () => {
  test("when internet is down", () => {
    const { result } = renderHook(() => useRate())

    act(() => {
      expect(result.current.getRate("GBP", "ddd")).toBe(1.3)
      expect(result.current.getRate("BTC", "ccc")).toBe(30000)
    })

    // console.log(result.current.getRate())
    // expect(result.current.rate).toBe(1.3)
  })
})
