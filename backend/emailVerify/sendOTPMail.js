import nodemailer from 'nodemailer';
import dns from 'dns';

export const sendOTPMail = async (email, otp) => {
    let host = 'smtp.gmail.com';
    try {
        const addresses = await dns.promises.resolve6('smtp.gmail.com');
        if (addresses.length > 0) host = addresses[0];
    } catch (e) { }

    const transporter = nodemailer.createTransport({
        host: host,
        port: 587,
        secure: false, // true for 465, false for other ports
        tls: { servername: 'smtp.gmail.com' },
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailConfigurations = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        html: `
        <h1>Password Reset OTP</h1>
        <p>Your OTP is ${otp}</p>
        `,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailConfigurations, (error, info) => {
            if (error) {
                console.error("Error sending OTP email:", error);
                reject(error);
            } else {
                console.log('OTP sent successfully');
                console.log(info);
                resolve(info);
            }
        });
    });
}

