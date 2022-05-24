import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAppContext } from "../context";
import { IPoll } from "../hooks/useWallet";
import styles from "../styles/Index.module.css";
import { ethers } from "ethers";
import { createContractInstance } from "../utils/connect";
import VotingPoll from "../constants/VotingPoll.json";
import { convertWeiToNumber } from "../utils/helper";

function Vote() {
  const router = useRouter();
  const context: any = useAppContext();
  const [singlePoll, setSinglePoll] = useState<
    { name: string; id: number; voteAmount: number }[]
  >([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [pollTitle, setPollTitle] = useState("");
  const [pollContractInstance, setPollContractInstance] =
    useState<ethers.Contract | null>(null);

  const { id } = router.query;

  useEffect(() => {
    if (id) {
      // set contract instance
      const pollInstance = createContractInstance(
        id as string,
        VotingPoll.abi,
        context.walletData?.signer!
      );
      setPollContractInstance(pollInstance);
      getPollDetails();
    }
  }, [id]);

  useEffect(() => {
    if (pollContractInstance) {
      isUserValidVoter();
    }
  }, [pollContractInstance]);

  const getPollDetails = () => {
    const poll = context.polls.find((poll: IPoll) => poll.id === id);
   setPollTitle(poll.title);

    const singlePoll = poll.options.map((data: any) => {
      const voteId = ethers.utils.formatEther(data[1]);
      const id = convertWeiToNumber(voteId);
      const voteAmount = convertWeiToNumber(ethers.utils.formatEther(data[2]));
      return {
        name: data[0],
        id,
        voteAmount,
      };
    });
    setSinglePoll(singlePoll);
  };

  const isUserValidVoter = async () => {
    try {
      const voterDetails = await pollContractInstance!.getVoter(
        context.address
      );
    setHasVoted(voterDetails[0]);
    } catch (error) {
      alert(error);
    }
  };

  const vote = async (voteId: string) => {
    try {
      await pollContractInstance!.vote(voteId);
      await context.getPools()
      getPollDetails()
    } catch (error) {
      alert(error);
    }
  };

  const handleCheckboxClick = async (id: string) => {
    await vote(id);
    setHasVoted(true);
  };

  return (
    <div className={styles.main}>
      <div>
        {pollTitle && <h3>{pollTitle}</h3>}
        <ul>
          {!hasVoted &&
            singlePoll.map((newData, index) => (
              <li className={styles.list} key={index}>
                <input
                  onChange={(e) => handleCheckboxClick(e.target.value)}
                  type="checkbox"
                  value={newData.id}
                />{" "}
                {newData.name}
              </li>
            ))}
        </ul>
        {hasVoted && (
          <div>
            <div>You voted </div>
            <div>
              <h3>Results:</h3><small className={styles.red}>may take some time to update result</small>
              <ul>
                {singlePoll.map((poll, index) => (
                  <ol key={index}>
                    {poll.name}: {poll.voteAmount}
                  </ol>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Vote;
