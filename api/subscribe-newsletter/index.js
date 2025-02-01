import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const generalAudienceID = 'a788a3ee-2f44-4557-a5b9-e8ad6e847cfd'

export default async function handler(request, response) {
    const { name, email } = request.body

    const done = await resend.contacts.create({
        email: email,
        firstName: name,
        lastName: '',
        unsubscribed: false,
        audienceId: generalAudienceID,
    });

    console.log("Done", done)

    return response.status(200).json({
        ok: true
    });
}