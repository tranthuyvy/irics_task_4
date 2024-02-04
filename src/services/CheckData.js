export const CheckSpecialInputCharacter = (search) => {
    // eslint-disable-next-line no-useless-escape
    let format = /[!#$%^&*()_+=\[\]{};':"\\|<>\/?]+/;
    if (format.test(search)) {
        return true;
    } else {
        return false;
    }
}