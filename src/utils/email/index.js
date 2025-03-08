import nodemailer from "nodemailer"
import { otpHtml } from '../../templates/otp.js'


export const sendEmail =async ({to , subject , html}) => {
try {
    const transporter = nodemailer.createTransport({
        host : "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASS
        },
        pool: false,
    })
    
    const info = await transporter.sendMail({
        from: `"Search Job APP" <${[process.env.EMAIL_USER]}> ` ,
        to,
        subject,
        html,
    })
    
    if(info.rejected.length>0) return false
    console.log('Email sent successfully:', info.response)
    return true
} catch (error) {
    console.error('Error sending email:', error.message)
    return false;
}
}

export const sendOtp = async ({email , otp}) => {
    
    const html = otpHtml.replace('{{otp}}' , otp)

    const isSent = await sendEmail({
        to: email,
        subject: 'OTP',
        html,
    })

    if (!isSent) {
        return new Error('Email not sent, please try again', { cause: 500 }) 
    }

    return isSent
}


