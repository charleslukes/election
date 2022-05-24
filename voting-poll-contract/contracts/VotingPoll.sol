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

    function getAllOptions() public view returns (Options[] memory) {
        uint256 optionLength = options.length;
        Options[] memory _newOptions = new Options[](optionLength);
        for (uint256 i = 0; i < optionLength; ) {
            Options storage _options = options[i];
            _newOptions[i] = _options;
            unchecked {
                i++;
            }
        }
        return _newOptions;
    }

    function getVoter(address _voter) public view returns (bool, uint256) {
        return (voters[_voter].voted, voters[_voter].votedFor);
    }
}
