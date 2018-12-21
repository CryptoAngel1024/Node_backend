/* eslint-disable no-continue */
// Generate random number of uppercase letters,
const genUpperCase = (num) => {
    // randaomly select letters withing ascii characters
    let string = ''
    for (let i = 0; i <= num; i += 1) {
     // select randomNumber
      const capLetter = Math.floor(Math.random() * 26) + 65
    // convert number to caps
      string += String.fromCharCode(capLetter)
    }
    return string
};
// generate random numbers
const genNums = (num) => {
    let string = ''
    for (let i = 0; i <= num; i += 1) {
      const number = Math.floor(Math.random() * 10)
      string += number
    }
    return string
}

// generate lowercase charactesr
const genLowerCase = (num) => {
     // randaomly select letters withing ascii characters
    let string = '';
    for (let i = 0; i <= num; i += 1) {
     // select randomNumber
    const lowLetter = Math.floor(Math.random() * 25) + 97;
    // convert number to caps
      string += String.fromCharCode(lowLetter);
    }
    return string;
};
const isUpperCase = (char) => char.match(RegExp('[A-Z]'))
const isLowerCase = (char) => char.match(RegExp('[a-z]'));
const isLetter = (char) => isLowerCase(char) || isUpperCase(char);
const isDigit = (char) => char.match(RegExp('[0-9]'));
  // this function implements all methods
const generatePassword = (passLen, options = {letters: 4, numbers: 2}) => {
    const generators = [genUpperCase, genNums, genLowerCase];
    let randomString = '';
    const maxRuns = 100; // prevent forloop running indefinitely
    
    for ( let i = 0 ;randomString.length < passLen && i < maxRuns; i += 1) {
        const initialFunctionRunIndex = Math.floor(Math.random() * generators.length);
        const char = generators[initialFunctionRunIndex](1);
        if (!options) {
            randomString += char;
            continue;
        }
        const matchLetters = randomString.match(RegExp('[A-Z]', 'g'))
        const matchDigits =  randomString.match(RegExp('[0-9]', 'g'))
        // if both criteria for digits and letters met, append char till required length 
        if (matchLetters && matchLetters.length >= options.letters &&
            matchDigits && matchDigits.length >= options.numbers
        ) {
            randomString += char;
            continue;
        }
        // letters requirements met skip
        if (isLetter(char) && matchLetters && matchLetters.length >= options.letters) {
            continue;
        }
        // digit requirements met skip
        if (isDigit(char) && matchDigits && matchDigits.length >= options.numbers) {
            continue;
        }
        randomString += char;
    }
    return randomString
}
module.exports = {
    generatePassword
}