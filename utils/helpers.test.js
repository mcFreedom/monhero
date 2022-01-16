import { helpers } from "./helpers"
const { institutionLanguage } = helpers

describe("institutionLanguage", () => {
  test("returns location with real Estate", () => {
    // console.log(result.current.getRate())
    expect(institutionLanguage("realEstate")).toBe("")
  })
  test("returns institution", () => {
    // console.log(result.current.getRate())
    expect(institutionLanguage()).toBe("institution")
  })
})
