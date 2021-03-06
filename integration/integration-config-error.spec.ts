import { Selector } from "testcafe";

fixture("Document Creator").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-local-config.json";
const ConfigWithError = "./../src/test/fixtures/sample-error-config.json";
const ConfigErrorFile = "./../src/test/fixtures/sample-empty-error-config.json";

const Title = Selector("h1");
const ButtonReset = Selector("[data-testid='reset-button']");
const ErrorCantReadFile = Selector("[data-testid='error-cannot-read-file']");
const ConfigError = Selector("[data-testid='config-error']");

test("Upload configuration file, choose form, fill form, preview form, submit form correctly", async (t) => {
  // upload invalid config file(without wallet)
  await t.setFilesToUpload("input[type=file]", [ConfigWithError]);
  await t.expect(ConfigError.textContent).contains("Config is malformed");

  // upload invalid file that is not a config file
  await t.setFilesToUpload("input[type=file]", [ConfigErrorFile]);
  await t.expect(ErrorCantReadFile.textContent).contains("File cannot be read");

  // upload config and reset config file
  await t.setFilesToUpload("input[type=file]", [Config]);
  await t.expect(Title.textContent).contains("Login with Password");
  await t.click(ButtonReset);
  await t.expect(Title.textContent).contains("Upload Configuration File");
});
