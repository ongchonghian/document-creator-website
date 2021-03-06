import { ConfigFile } from "../../types";
import { decryptWallet } from "./decrypt";
import sample from "../../test/fixtures/sample-config.json";

const configFile = sample as ConfigFile;

describe("decryptWallet", () => {
  it("should return wallet when decryption is successful", async () => {
    const wallet = await decryptWallet(configFile, "password");
    expect(wallet.address).toBe("0x1245e5B64D785b25057f7438F715f4aA5D965733");
    expect(wallet.privateKey).toBe(
      "0x416f14debf10172f04bef09f9b774480561ee3f05ee1a6f75df3c71ec0c60666"
    );
  });

  it("should throw when decryption fails", async () => {
    await expect(decryptWallet(configFile, "wrongPassword")).rejects.toThrow(/invalid password/);
  });
});
