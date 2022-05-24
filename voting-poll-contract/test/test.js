const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingPollFactory", function () {
  let VotingPollFactory;
  let votingPollFactory;
  let VotingPoll;
  let votingPollOne;
  let votingPollTwo;
  let owner;
  let addr1;

  before(async function () {
    [owner, addr1] = await ethers.getSigners();
    // Get the ContractFactory and Signers here.
    VotingPollFactory = await ethers.getContractFactory("VotingPollFactory");

    votingPollFactory = await VotingPollFactory.deploy();

    VotingPoll = await ethers.getContractFactory("VotingPoll");

    // create first poll
    await votingPollFactory.createPoll(
      "Best Programming Language",
      "In this poll we get the best programming language",
      ["Javascript", "Java", "Python"]
    );

    // create second poll
    await votingPollFactory.createPoll(
      "Most used Programming Language",
      "In this poll we get the most used programming language",
      ["Javascript", "Java", "Python", "Rust"]
    );

    // create third poll
    await votingPollFactory.createPoll(
      "Most loved Programming Language",
      "In this poll we get the most loved programming language",
      ["Ruby", "Rust", "Solidity", "Javascript", "Java", "Python"]
    );

    // initialize polls
    votingPollOne = VotingPoll.attach(votingPollFactory.votingPoll(0));
    votingPollTwo = VotingPoll.attach(votingPollFactory.votingPoll(1));
  });

  it("Should contain three polls", async function () {
    expect(await votingPollFactory.numberOfPolls()).to.equal(3);
  });

  it("Should test first poll", async function () {
    expect(await votingPollOne.title()).to.equal("Best Programming Language");
    expect(await votingPollOne.description()).to.equal(
      "In this poll we get the best programming language"
    );
    const option = await votingPollOne.options(1);
    expect(option[0]).to.equal("Java");
  });

  it("Should be able to vote on any poll", async function () {
    // voting on the second poll
    await votingPollTwo.vote(0);
    const voter = await votingPollTwo.voters(owner.address);
    // expect owner to have voted;
    expect(voter[0]).to.be.true;
    // this address has not voted yet
    const voter2 = await votingPollTwo.voters(addr1.address);
    expect(voter2[0]).to.be.false;

    // second address votes now
    await votingPollTwo.connect(addr1).vote(0);
    const voter3 = await votingPollTwo.voters(addr1.address);
    expect(voter3[0]).to.be.true;
  });

  it("Should revert if already voted on that poll", async function () {
    await expect(votingPollTwo.vote(1)).to.be.revertedWith(
      "The voter already voted"
    );
  });

  it("Should return the number of votes for poll", async function () {
    expect(await votingPollOne.numberOfVotesForPoll()).to.be.equal(0);
    expect(await votingPollTwo.numberOfVotesForPoll()).to.be.equal(2);
  });
});
