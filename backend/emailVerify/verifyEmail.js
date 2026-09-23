import nodemailer from 'nodemailer';
import dns from 'dns';

export const sendEmail = async (email, token) => {
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


        subject: 'Email Verification',


        text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           http://localhost:5173/verify/${token} 
           Thanks`
    };

    try {
        const info = await transporter.sendMail(mailConfigurations);
        console.log('Email Sent Successfully');
        console.log(info);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}





