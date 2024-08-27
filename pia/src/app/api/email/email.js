import mailjet from 'node-mailjet';

// Créez une instance de Mailjet avec vos clés API
const mailjetClient = mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
);

// Fonction pour envoyer un email
export default async function sendEmail(otp, email, name) {
    const emailOptions = {
        Messages: [
            {
                From: {
                    Email: 'pa.devcode@gmail.com',
                    Name: 'Buster'
                },
                To: [
                    {
                        Email: email,
                        Name: name
                    }
                ],
                Subject: 'Account verify',
                TextPart: `Your OTP code is ${otp}`,
                HTMLPart: `
                 <h1>You sended a request</h1>
                 <h3>This code is private</h3>
                <span>Your OTP code is ${otp}</span>
                `
            }
        ]
    };

    try {
        const result = await mailjetClient
            .post('send', { version: 'v3.1' })
            .request(emailOptions);
        return result.body;
    } catch (err) {
        console.error('Error sending email:', err.message);
        throw new Error('Error sending email');
    }
}
