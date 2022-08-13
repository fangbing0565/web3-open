export const idCard = /^[0-9A-Za-z]{18}$/;

export const notChinese = /^[^\u4e00-\u9fa5]+$/;

export const notBlank = /^[^\s]+$/;

export const onlyNumber = /^[0-9]+$/;

export const onlyLetterAndnumber = /^[a-zA-Z0-9]+$/;

export const only1to99 = /^[1-9]\d{0,1}$/;

export const passwordRegexp = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/;

export const mobileReg = /^1[^1|2][0-9]\d{8}$/;

export const numberLetterSymbol = /^[\u0021-\u007e]{36}$/;

export const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

export const HTTPReg = /^(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;

export const onlyEnglishReg = /^[ 0-9A-Za-z]*$/;
