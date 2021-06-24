import webdriver from 'selenium-webdriver'

export const getDriver = async () => {
  const capabilities = webdriver.Capabilities.chrome()
  capabilities.set('chromeOptions', {
    args: ['--headless', '--no-sandbox', '--disable-gpu', `--window-size=1980,1200`],
  })
  return await new Builder().withCapabilities(capabilities).build()
}
