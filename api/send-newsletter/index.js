import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const generalAudienceID = 'a788a3ee-2f44-4557-a5b9-e8ad6e847cfd'

export default async function handler(request, response) {
    // const done = await resend.contacts.create({
    //     email: email,
    //     firstName: name,
    //     lastName: '',
    //     unsubscribed: false,
    //     audienceId: generalAudienceID,
    // });

    const dayOfWeek = new Date().getDay();
    const days = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    const fetchedPhrases = await fetch('https://english-flow-mu.vercel.app/api/fetch-phrases?editionDate=' + new Date().toISOString().split('T')[0]);
    const { phrases } = await fetchedPhrases.json();

    const { data } = await resend.contacts.list({
        audienceId: generalAudienceID,
    });

    for (const { email, first_name } of data.data) {
        await resend.emails.send({
            from: 'English Flow <no-reply@updates.englishflow.ai>',
            to: `${first_name} <${email}>`,
            replyTo: 'app@englishflow.ai',
            subject: `Daily English Practice - ${days[dayOfWeek]}`,
            html: template({
                date: getFormattedDate(),
                phrases,
                toName: "Sergio"
            }),
        });
    }

    return response.status(200).json({
        ok: true
    });
}

function getFormattedDate() {
    const options = { weekday: 'long', day: '2-digit', month: 'short' };
    const today = new Date();
    return today.toLocaleDateString('en-GB', options);
}

function generatePhrasesHTML(phrases) {
    return phrases.map(phraseObject => {
        const {
            speaker: { avatar, name },
            englishType,
            sourceType,
            sourceUrl,
            phrase,
            audio,
            parts
        } = phraseObject;

        const partsHTML = parts.map(part => `
            <span style="border-bottom:2px solid rgba(0, 0, 0, 0.1);display:inline-block;border-radius:3px;margin-right:5px">${part['en']}</span>
        `).join('');

        // Define the emoji for each English type
        let englishTypeEmoji = '';
        if (englishType.includes('British')) {
            englishTypeEmoji = '🇬🇧'; // British flag emoji
        } else if (englishType.includes('Canadian')) {
            englishTypeEmoji = '🇨🇦'; // Canadian flag emoji
        } else if (englishType.includes('Aussie')) {
            englishTypeEmoji = '🇦🇺'; // Australian flag emoji
        } else if (englishType.includes('American')) {
            englishTypeEmoji = '🇺🇸'; // American flag emoji
        }

        const redirectUrl = `https://www.englishflow.ai#editionDate=${new Date().toISOString().split('T')[0]}`;

        return `
        <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
            <tbody>
                <tr>
                    <td>
                        <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tbody style="width:100%">
                                <tr style="width:100%">
                                    <td data-id="__react-email-column" style="vertical-align:top;padding-top:13px">
                                        <a href="${redirectUrl}" style="color:#000;text-decoration-line:none;text-decoration:none" target="_blank">
                                            <img alt="${name}'s avatar" height="48" src="${avatar}" style="display:block;outline:none;border:none;text-decoration:none;border-radius:100px" width="48"/>
                                        </a>
                                    </td>
                                    <td class="w-[85%]" data-id="__react-email-column" style="padding-left:15px;width:100%">
                                        <a href="${redirectUrl}" style="color:#000;text-decoration-line:none;text-decoration:none" target="_blank">
                                            <p class="m-0 text-[20px] font-semibold leading-[28px] text-gray-900" style="font-size:16px;line-height:24px;margin:16px 0;font-weight:600;margin-bottom:0">
                                                ${name}
                                            </p>
                                            <p class="m-0 text-[20px] font-semibold leading-[28px] text-gray-900" style="font-size:14px;line-height:24px;margin:16px 0;margin-top:0;opacity:0.75;margin-bottom:5px">
                                                 ${englishTypeEmoji} ${englishType}
                                            </p>
                                            <p class="m-0 mt-[8px] text-[16px] leading-[24px] text-gray-500" style="font-size:18px;line-height:24px;margin:16px 0;font-weight:600;margin-top:5px">
                                                ${partsHTML}
                                            </p>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>`;
    }).join('');
}

const template = ({ date, phrases, toName }) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <link rel="preload" as="image" href="https://app.englishflow.ai/logo.png" />
    <link
      rel="preload"
      as="image"
      href="https://app.englishflow.ai/cover.jpg"
    />
    <link
      rel="preload"
      as="image"
      href="https://images.ctfassets.net/ji978lu940nr/5bZBIltucxfL4VxFsLU4ug/04265dbd749aa7ef91d5aa01d7b2b65c/avatar.jpg"
    />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <!--$-->
  </head>
  <div
    style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0"
  >
    The daily English practice update
  </div>
  <body
    style='background-color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
  >
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="max-width:37.5em"
    >
      <tbody>
        <tr style="width:100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="padding:30px 20px"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                    >
                      <tbody style="width:100%">
                        <tr style="width:100%">
                          <td data-id="__react-email-column" style="width:65px">
                            <img
                              height="50"
                              src="https://app.englishflow.ai/logo.png"
                              style="display:block;outline:none;border:none;text-decoration:none"
                            />
                          </td>
                          <td data-id="__react-email-column">
                            <h1 style="font-size:16px;font-weight:bold">
                              English Flow
                            </h1>
                          </td>
                          <td data-id="__react-email-column">
                            <p
                              style="font-size:14px;line-height:24px;margin:16px 0;opacity:0.3;font-weight:500;text-align:right"
                            >
                                ${date}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="border:1px solid rgb(0,0,0, 0.1);border-radius:3px;overflow:hidden"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                    >
                      <tbody style="width:100%">
                        <tr style="width:100%">
                          <img
                            src="https://app.englishflow.ai/cover.jpg"
                            style="display:block;outline:none;border:none;text-decoration:none;max-width:100%"
                            width="620"
                          />
                        </tr>
                      </tbody>
                    </table>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding:20px;padding-bottom:50px"
                    >
                      <tbody style="width:100%">
                        <tr style="width:100%">
                          <td data-id="__react-email-column">
                            <h1
                              style="font-size:32px;font-weight:bold;text-align:center"
                            >
                              Hi
                              <!-- -->${toName}<!-- -->,
                            </h1>
                            <h2
                              style="font-size:22px;font-weight:bold;text-align:center"
                            >
                              Here&#x27;s the daily English practice update
                            </h2>
                            <table
                              align="center"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              class="my-[16px]"
                            >
                              <tbody>
                                <tr>
                                  <td>
                                    <table
                                      align="center"
                                      width="100%"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                    >
                                      <tbody>
                                        <tr>
                                          <td>
                                            ${generatePhrasesHTML(phrases)}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              style="font-size:12px;line-height:24px;margin:16px 0;text-align:center;color:rgb(0,0,0, 0.7)"
            >
              © 2024 | English Flow - Master English Phrases |
              www.englishflow.ai
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <!--/$-->
  </body>
</html>
`