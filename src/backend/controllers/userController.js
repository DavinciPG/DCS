async function verifyUsernameInput(input) {
    // username length is 3,16 char
    const regex = /^[a-zA-Z0-9_-]{3,16}$/;
    if(!regex.test(input))
        return false;

    return true;
}

async function verifyEmailInput(input) {
    const regex = /^[a-zA-Z0-9._%+-]+@voco.ee/;
    if(!regex.test(input))
        return false;

    return true;
}

module.exports = {
    verifyUsernameInput,
    verifyEmailInput,
}