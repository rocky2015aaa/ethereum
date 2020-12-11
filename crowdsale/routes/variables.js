function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true,
        writable : true
    });
}

// can be changed
define("GAS_LIMIT", 400000);
define("GAS_PRICE", 60000000000);