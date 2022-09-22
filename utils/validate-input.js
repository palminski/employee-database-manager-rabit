const validateInput = function (input) {
    if (!input || !input.trim()) {
        console.log("-Error- Please give a valid input");
        return false;
    }
    return true;
}

module.exports = validateInput;