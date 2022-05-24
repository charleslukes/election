import { Contract, ContractInterface, ethers } from "ethers";

let provider: ethers.providers.Web3Provider;
let signer: ethers.providers.JsonRpcSigner;

export const connectWeb3 = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.enable();
      // A Web3Provider wraps a standard Web3 provider, which is
      // what Metamask injects as window.ethereum into each page
      provider = new ethers.providers.Web3Provider(window.ethereum, "any");

      // The Metamask plugin also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, you need the account signer...
      signer = provider.getSigner();
    } catch (error) {
      console.log("Error ==>", error);

      throw new Error(error as any);
    }
  }

  return {
    provider,
    signer,
  };
};

export const createContractInstance = (
  contractAddress: string,
  abi: ContractInterface,
  _provider: ethers.providers.Web3Provider | ethers.Signer
): Contract => {
  return new ethers.Contract(contractAddress, abi, _provider);
};


declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}
