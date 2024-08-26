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
                    Name: 'Your Name'
                },
                To: [
                    {
                        Email: email,
                        Name: name
                    }
                ],
                Subject: 'Your OTP Code',
                TextPart: `Your OTP code is ${otp}`,
                HTMLPart: `<h3>Your OTP code is ${otp}</h3>`
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
