const fs = require('fs/promises')
const {Builder, By} = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const compareImages = require('resemblejs/compareImages')


const HOST = 'http://localhost:4567'

describe('Responsive navigation', function () {
  let driver

  beforeAll(async () => {
    const options = new chrome.Options().headless()
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build()
  })

  beforeEach(async () => {
    await driver.get(HOST)
  })

  afterAll(() => {
    driver.quit()
  })

  describe('desktop', () => {
    beforeEach(() => {
      driver.manage().window().setRect({width: 1000, height: 800})
    })

    it('should not show the hamburger icon', async () => {
      const navIcon = await driver.findElement(By.className('nav-icon'))
      expect(await navIcon.isDisplayed()).toEqual(false)
    })

    it('should show only navigation items', async () => {
      const navItems = await driver.findElement(By.className('nav-items'))
      const navIcon = await driver.findElement(By.className('nav-icon'))
      expect(await navItems.isDisplayed()).toEqual(true)
      expect(await navIcon.isDisplayed()).toEqual(false)
    })

    it('should display all elements as it is shown on a template', async () => {
      await compareNavigationWithTemplate(driver, 'desktop', 8)
    })
  })

  describe('mobile', () => {
    beforeEach(() => {
      driver.manage().window().setRect({width: 700, height: 450})
    })

    it('should not show navigation items initially', async () => {
      const navItems = await driver.findElement(By.className('nav-items'))
      expect(await navItems.isDisplayed()).toEqual(false)
    })

    it('should show only the hamburger icon', async () => {
      const navIcon = await driver.findElement(By.className('nav-icon'))
      const navItems = await driver.findElement(By.className('nav-items'))
      expect(await navIcon.isDisplayed()).toEqual(true)
      expect(await navItems.isDisplayed()).toEqual(false)
    })

    it('should show navigation items when clicking on a navigation icon', async () => {
      let navItems = await driver.findElement(By.className('nav-items'))
      expect(await navItems.isDisplayed()).toEqual(false)

      const navIcon = await driver.findElement(By.className('nav-icon'))
      await navIcon.click()
      await waitExpandAnimation(driver)

      navItems = await driver.findElement(By.className('nav-items'))
      expect(await navItems.isDisplayed()).toEqual(true)
    })

    it('should display all elements of collapsed navigation as it is shown on a template', async () => {
      await compareNavigationWithTemplate(driver, 'mobile-collapsed')
    })

    it('should display all elements of expanded navigation as it is shown on a template', async () => {
      const navIcon = await driver.findElement(By.className('nav-icon'))
      await navIcon.click()
      await waitExpandAnimation(driver)
      await compareNavigationWithTemplate(driver, 'mobile-expanded')
    })
  })
})

const compareNavigationWithTemplate = async (driver, stateName, epsilon) => {
  const actualNav = await driver.findElement(By.className('nav'))
  const actualNavImage = await actualNav.takeScreenshot()

  const actualNavImageBase64 = 'data:image/png;base64,' + actualNavImage
  const templateImageBase64 = await fs.readFile(`./test/fixtures/navigation-${stateName}.png`)

  const {misMatchPercentage, getBuffer} = await compareImages(actualNavImageBase64, templateImageBase64)
  await fs.writeFile(`diff-${stateName}.png`, getBuffer(), 'base64')

  expect(parseFloat(misMatchPercentage)).toBeLessThan(epsilon || 1)
}

const waitExpandAnimation = async (driver) => {
  await driver.sleep(500)
}