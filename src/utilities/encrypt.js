const argon2 = require('argon2')

const encrypt = async (text, options) => {
    try {
        if (options) {
            return await argon2.hash(text, options)
        }
        return await argon2.hash(text);
    } catch (err) {
        console.log('Error: ', err)
        return false;
    }
};

const decrypt = async (hash, password, options) => {
    try {
        if (options) 
            return await argon2.verify(hash, password, options);
        return await argon2.verify(hash, password);
    } catch (err) {
        console.log('Error: ', err)
        return false;
    }
};

module.exports = {
    encrypt,
    decrypt
};