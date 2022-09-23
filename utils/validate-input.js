const validateInput = function (input) {
    if (!input || !input.trim()) {
        console.log("-Error- Please give a valid input");
        return false;
    }
    return true;
}

const validateNumber = function (input) {
    // console.log(input);
    // console.log(typeof input);
    const asNumber = parseFloat(input);
    
    
    if (isNaN(asNumber) || Math.round(asNumber) >= 10000000) {
        console.log("-Error- Please give a valid input");
        return false;
    }
    return true;
}

module.exports = {
    validateInput: validateInput,
    validateNumber: validateNumber
};