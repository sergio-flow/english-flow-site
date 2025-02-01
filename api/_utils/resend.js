import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export function sendEmail() {
    return resend.emails.send({
        from: 'you@example.com',
        to: 'user@gmail.com',
        replyTo: 'you@example.com',
        subject: 'hello world',
        html: '<strong>it works!</strong>',
    });
}

export const addContact = (name, email) => {
    return resend.contacts.create({
        email: email,
        firstName: name,
        lastName: '',
        unsubscribed: false,
        audienceId: 'a788a3ee-2f44-4557-a5b9-e8ad6e847cfd',
    });
}