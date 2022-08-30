import {
  getStorageAt,
  loadFixture,
} from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import "@nomiclabs/hardhat-web3";
import { ethers, storageLayout } from "hardhat";

describe("Link", function () {
  async function depolyContractixture() {
    const [owner, otherAccount, thirdAccount] = await ethers.getSigners();
    const LinkTree = await ethers.getContractFactory("LinkTree");
    const linkTree = await LinkTree.deploy();

    return { owner, otherAccount, thirdAccount, linkTree };
  }

  describe("Depolyment of Contract", () => {
    it("Should deploy contact and ouput contract address", async () => {
      const { linkTree, owner } = await loadFixture(depolyContractixture);

      expect(linkTree.address).to.be.a.properAddress;
      expect(await linkTree.owner()).to.equal(owner.address);
    });
  });

  describe("Error Cases", () => {
    it("should revert is link is null", async () => {
      const { linkTree } = await loadFixture(depolyContractixture);

      expect(
        await linkTree.addLink(
          ethers.utils.formatBytes32String(""),
          ethers.utils.formatBytes32String("EtherScan")
        )
      ).to.revertedWith("Link should not be null or length 1");

      expect(
        await linkTree.addLink(
          ethers.utils.formatBytes32String("1"),
          ethers.utils.formatBytes32String("EtherScan")
        )
      ).to.revertedWith("Link should not be null or length 1");
    });
  });

  describe("Success cases", () => {
    it("Should create a new Link", async () => {
      const { linkTree, owner } = await loadFixture(depolyContractixture);

      const byte32Link = ethers.utils.formatBytes32String("https://google.com");
      const byte32Title = ethers.utils.formatBytes32String("Google");
      await expect(
        await linkTree.addLink(
          ethers.utils.formatBytes32String("https://google.com"),
          ethers.utils.formatBytes32String("Google")
        )
      )
        .to.emit(linkTree, "CreateLink")
        .withArgs(byte32Link, byte32Title, 1);

      console.log(await getStorageAt(linkTree.address, 1));
    });
  });
  it("Should create a correct IDs", async () => {
    const { linkTree, owner } = await loadFixture(depolyContractixture);

    const byte32Link = ethers.utils.formatBytes32String("https://google.com");
    const byte32Title = ethers.utils.formatBytes32String("Google");
    await expect(
      await linkTree.addLink(
        ethers.utils.formatBytes32String("https://google.com"),
        ethers.utils.formatBytes32String("Google")
      )
    )
      .to.emit(linkTree, "CreateLink")
      .withArgs(byte32Link, byte32Title, 1);

    await expect(
      await linkTree.addLink(
        ethers.utils.formatBytes32String("https://google.com"),
        ethers.utils.formatBytes32String("Google")
      )
    )
      .to.emit(linkTree, "CreateLink")
      .withArgs(byte32Link, byte32Title, 2);

    expect(await linkTree.getUserLinks()).to.be.length(2);
  });
});
