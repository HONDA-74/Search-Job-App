import CryptoJS from "crypto-js";


const SECRET_KEY = process.env.CRYPTO_KEY


const IV = CryptoJS.enc.Utf8.parse('1234567890123456')


export const encryptPhone = (phone) => {
    const encryptedPhone = CryptoJS.AES.encrypt(phone, CryptoJS.enc.Base64.parse(SECRET_KEY), { iv: IV }).toString()
    
    return encryptedPhone
}

export const decryptPhone = (encryptedPhone) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPhone, CryptoJS.enc.Base64.parse(SECRET_KEY), { iv: IV })
    const decryptedPhone = bytes.toString(CryptoJS.enc.Utf8)
    return decryptedPhone
}

