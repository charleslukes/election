//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./VotingPoll.sol";

contract VotingPollFactory {
    VotingPoll[] public votingPoll;
    uint256 public numberOfPolls;

    function createPoll(
        string memory _title,
        string memory _description,
        string[] memory _options
    ) public {
        VotingPoll newVotingPoll = new VotingPoll(
            _title,
            _description,
            _options
        );
        votingPoll.push(newVotingPoll);
        numberOfPolls = numberOfPolls + 1;
    }

    function allPolls()
        public
        view
        returns (VotingPoll[] memory)
    {
        return votingPoll;
    }
}
