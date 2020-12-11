pragma solidity ^0.4.21;


/**
 * @title IterableMap
 * @dev see https://gist.github.com/Arachnid/59159497f124fdbff14bc2ca960b77ba
 */

library IterableMap {
    struct entry {
        // Equal to the index of the key of this item in keys, plus 1.
        uint keyIndex;
        uint value;
    }

    struct itmap {
        mapping(address => entry) data;
        address[] keys;
    }
    
    function insert(itmap storage self, address key, uint value) internal returns (bool replaced) {
        entry storage e = self.data[key];
        e.value = value;
        if (e.keyIndex > 0) {
            return true;
        } else {
            e.keyIndex = ++self.keys.length;
            self.keys[e.keyIndex - 1] = key;
            return false;
        }
    }
    
    function remove(itmap storage self, address key) internal returns (bool success) {
        entry storage e = self.data[key];
        if (e.keyIndex == 0)
            return false;
        
        if (e.keyIndex < self.keys.length) {
            // Move an existing element into the vacated key slot.
            self.data[self.keys[self.keys.length - 1]].keyIndex = e.keyIndex;
            self.keys[e.keyIndex - 1] = self.keys[self.keys.length - 1];
            self.keys.length -= 1;
            delete self.data[key];
            return true;
        }
    }
    
    function contains(itmap storage self, address key) internal constant returns (bool exists) {
        return self.data[key].keyIndex > 0;
    }
    
    function size(itmap storage self) public returns (uint) {
        return self.keys.length;
    }
    
    function get(itmap storage self, address key) internal constant returns (uint) {
        return self.data[key].value;
    }
    
    function getKey(itmap storage self, uint idx) internal constant returns (address) {
        return self.keys[idx];
    }
}