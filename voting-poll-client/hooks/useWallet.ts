import { useEffect, useState } from "react";
import { createContractInstance } from "../utils/connect";
import VotingPollFactory from "../constants/VotingPollFactory.json";
import VotingPoll from "../constants/VotingPoll.json";

import {
  JsonRpcProvider,
  JsonRpcSigner,
  Web3Provider,
} from "@ethersproject/providers";
import { VOTING_FACTORY_CONTRACT } from "../constants";


export type IPoll = {
    title: string;
    description: string;
    id: string;
    options: Array<string>
}

export type IPollList = Array<IPoll>;

export function useWallet() {
  const [walletData, setWalletData] = useState<{
    provider: Web3Provider;
    signer: JsonRpcSigner;
  }>();
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [polls, setPolls] = useState<IPollList>([]);

  useEffect(() => {
    if (isConnected) {
      getPools();
    }
  }, [isConnected]);

  const getPools = async () => {
    const votingPF = createContractInstance(
      VOTING_FACTORY_CONTRACT,
      VotingPollFactory.abi,
      walletData?.provider!
    );

    const allPolls = await votingPF.allPolls();
    
    let pollsList: IPollList = [];
    for (const pollsAddress of allPolls) {
      const singlePoll = createContractInstance(
        pollsAddress,
        VotingPoll.abi,
        walletData?.provider!
      );
      const title = await singlePoll.title();
      const description = await singlePoll.description();
      const options = await singlePoll.getAllOptions();
      pollsList = [...pollsList, { title, description, options, id: pollsAddress
    }];
    }
    setPolls(pollsList);
  };

  const connectWallet = async () => {
    const ethereumExtension = await import("../utils/connect");
    const data = await ethereumExtension.connectWeb3();
    setWalletData(data);
    if (!data.provider) {
      alert("Metamask not installed, pls install extension...");
      setIsConnected(false);
      return;
    }

    const allAccounts = await data.provider.listAccounts();
    const chainId = await data.provider.getNetwork();
    const ropstenChainId = 3;
    if (chainId.chainId !== ropstenChainId) {
      switchNetwork(`0x${ropstenChainId.toString(16)}`);
    }
    const address = allAccounts[0];
    setIsConnected(true);
    setAddress(address);
  };

  return {
    getPools,
    connectWallet,
    walletData,
    polls,
    isConnected,
    address,
  };
}

// since its deployed on ropsten, we connect automatically to the ropsten network
const switchNetwork = async (chainId: string) => {
  const metamask = window.ethereum;
  await metamask.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId }],
  });
};
