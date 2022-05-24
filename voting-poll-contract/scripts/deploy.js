// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const VotingPollFactory = await hre.ethers.getContractFactory(
    "VotingPollFactory"
  );
  const votingPollFactory = await VotingPollFactory.deploy();

  await votingPollFactory.deployed();

  console.log("VotingPollFactory deployed to:", votingPollFactory.address);

  // create first poll
  const poll1 = await votingPollFactory.createPoll(
    "Best Programming Language",
    "In this poll we get the best programming language",
    ["Javascript", "Java", "Python"]
  );
  poll1.wait()

  // create second poll
  const poll2 = await votingPollFactory.createPoll(
    "Most used Programming Language",
    "In this poll we get the most used programming language",
    ["Javascript", "Java", "Python", "Rust"]
  );

  poll2.wait()

  // create third poll
  const poll3 = await votingPollFactory.createPoll(
    "Most loved Programming Language",
    "In this poll we get the most loved programming language",
    ["Ruby", "Rust", "Solidity", "Javascript", "Java", "Python"]
  );
  
  poll3.wait()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
