// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LinkTree is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _linkIds;
    struct Link {
        bytes32 link;
        bytes32 title;
        uint256 order;
    }
    mapping(address => Link[]) users;

    event CreateLink(bytes32 link, bytes32 title, uint256 order);

    function addLink(bytes32 link, bytes32 title) public {
        require(link.length > 1, "Link should not be null or length 1");
        require(title.length > 0, "Link title should not be null");

        _linkIds.increment();
        uint256 id = _linkIds.current();

        users[msg.sender].push(Link(link, title, id));
        emit CreateLink(link, title, id);
    }

    function updateOrder(uint256 indexFrom, uint indexTo)
        public
        returns (Link[] memory)
    {
        Link[] storage userPosts = users[msg.sender];
        userPosts[indexFrom].order = indexTo;
        userPosts[indexTo].order = indexFrom;

        return userPosts;
    }

    function getUserLinks() public view returns (Link[] memory) {
        return users[msg.sender];
    }

    function deleteAccount() public onlyOwner {
        delete users[msg.sender];
    }
}
