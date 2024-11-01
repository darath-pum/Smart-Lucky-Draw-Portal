import nodemailer from 'nodemailer';

var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
    port: parseInt(process.env.SMTP_PORT || '2525'),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export async function sendMailAsync(subject : string, to : string, content : string): Promise < void > {
    return new Promise<void>((resolve, reject) => {
        transport.sendMail({
            to,
            from: 'darathpum@gmail.com',
            subject,
            html: content
        }, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
