//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract VotingPoll {
    address private owner;
    string public title;
    string public description;
    uint256 public numberOfVotesForPoll;

    struct Voter {
        bool voted;
        uint256 votedFor;
    }

    struct Options {
        string name;
        uint256 id;
        uint256 votes;
    }

    Options[] public options;

    mapping(address => Voter) public voters;

    constructor(
        string memory _title,
        string memory _description,
        string[] memory _options
    ) {
        owner = msg.sender;
        title = _title;
        description = _description;

        uint256 optionsLength = _options.length;

        for (uint256 i = 0; i < optionsLength; ) {
            options.push(Options({name: _options[i], id: i + 1, votes: 0}));
            unchecked {
                i++;
            }
        }
    }

    function vote(uint256 id) public {
        address voter = msg.sender;
        require(!voters[voter].voted, "The voter already voted");
        voters[voter].voted = true;
        voters[voter].votedFor = id;
        numberOfVotesForPoll = numberOfVotesForPoll + 1;

        uint256 optionsLength = options.length;
        for (uint256 i = 0; i < optionsLength; ) {
            if (options[i].id == id) {
                options[i].votes = options[i].votes + 1;
                // no need to continue the loop
                break;
            }
            unchecked {
                i++;
            }
        }
    }
}
