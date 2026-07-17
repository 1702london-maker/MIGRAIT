import { Resend } from 'resend'
const FROM = 'Migrait <onboarding@resend.dev>'
function getResend() { return new Resend(process.env.RESEND_API_KEY) }

export async function sendWelcomeEmail(email: string, name: string) {
  return getResend().emails.send({
    from: FROM, to: email, subject: 'Welcome to Migrait',
    html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px"><h1 style="color:#0A0E1A;font-size:28px;font-weight:900;margin-bottom:8px">Welcome to Migrait, ${name}.</h1><p style="color:#6B7A8D;font-size:16px;line-height:1.7">Your account is ready. You can now connect your data sources, map your fields, and start migrating.</p><a href="${process.env.NEXT_PUBLIC_APP_URL}/app/dashboard" style="display:inline-block;margin-top:24px;padding:14px 28px;background:#E11D48;color:#fff;text-decoration:none;border-radius:100px;font-weight:700;font-size:15px">Go to your dashboard</a><p style="color:#6B7A8D;font-size:13px;margin-top:40px">Migrait — Migration, Accelerated.</p></div>`
  })
}

export async function sendMigrationCompleteEmail(email: string, _name: string, projectName: string, totalRecords: number, successfulRecords: number, failedRecords: number, migrationId: string) {
  const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL}/app/migrations/${migrationId}`
  return getResend().emails.send({
    from: FROM, to: email, subject: `Migration complete — ${projectName}`,
    html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px"><h1 style="color:#0A0E1A;font-size:28px;font-weight:900;margin-bottom:8px">Migration complete.</h1><p style="color:#6B7A8D;font-size:16px;line-height:1.7">Your migration for <strong style="color:#0A0E1A">${projectName}</strong> has finished.</p><div style="background:#F8FAFC;border:1px solid #E8ECF0;border-radius:12px;padding:24px;margin:24px 0"><div style="display:flex;justify-content:space-between;margin-bottom:12px"><span style="color:#6B7A8D;font-size:14px">Total records</span><span style="color:#0A0E1A;font-weight:700">${totalRecords.toLocaleString()}</span></div><div style="display:flex;justify-content:space-between;margin-bottom:12px"><span style="color:#6B7A8D;font-size:14px">Successful</span><span style="color:#059669;font-weight:700">${successfulRecords.toLocaleString()}</span></div><div style="display:flex;justify-content:space-between"><span style="color:#6B7A8D;font-size:14px">Failed</span><span style="color:#E11D48;font-weight:700">${failedRecords.toLocaleString()}</span></div></div><a href="${reportUrl}" style="display:inline-block;padding:14px 28px;background:#E11D48;color:#fff;text-decoration:none;border-radius:100px;font-weight:700;font-size:15px">View migration report</a><p style="color:#6B7A8D;font-size:13px;margin-top:40px">Migrait — Migration, Accelerated.</p></div>`
  })
}

export async function sendMigrationFailedEmail(email: string, name: string, projectName: string, errorMessage: string, migrationId: string) {
  return getResend().emails.send({
    from: FROM, to: email, subject: `Migration failed — ${projectName}`,
    html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px"><h1 style="color:#E11D48;font-size:28px;font-weight:900;margin-bottom:8px">Migration failed.</h1><p style="color:#6B7A8D;font-size:16px;line-height:1.7">Your migration for <strong style="color:#0A0E1A">${projectName}</strong> encountered an error and could not complete.</p><div style="background:#FFF5F5;border:1px solid #FEE2E2;border-radius:12px;padding:24px;margin:24px 0"><p style="color:#E11D48;font-size:14px;font-family:monospace;margin:0">${errorMessage}</p></div><a href="${process.env.NEXT_PUBLIC_APP_URL}/app/migrations/${migrationId}" style="display:inline-block;padding:14px 28px;background:#E11D48;color:#fff;text-decoration:none;border-radius:100px;font-weight:700;font-size:15px">View error details</a><p style="color:#6B7A8D;font-size:13px;margin-top:40px">Migrait — Migration, Accelerated.</p></div>`
  })
}

export async function sendQuarantineAlertEmail(email: string, name: string, projectName: string, quarantineCount: number, migrationId: string) {
  return getResend().emails.send({
    from: FROM, to: email, subject: `${quarantineCount} records quarantined — ${projectName}`,
    html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px"><h1 style="color:#0A0E1A;font-size:28px;font-weight:900;margin-bottom:8px">${quarantineCount} records need your attention.</h1><p style="color:#6B7A8D;font-size:16px;line-height:1.7">During the migration for <strong style="color:#0A0E1A">${projectName}</strong>, ${quarantineCount} records failed validation and have been placed in quarantine.</p><a href="${process.env.NEXT_PUBLIC_APP_URL}/app/quarantine" style="display:inline-block;padding:14px 28px;background:#E11D48;color:#fff;text-decoration:none;border-radius:100px;font-weight:700;font-size:15px">Review quarantined records</a><p style="color:#6B7A8D;font-size:13px;margin-top:40px">Migrait — Migration, Accelerated.</p></div>`
  })
}

export async function sendTeamInviteEmail(email: string, inviterName: string, organisationName: string, role: string, token: string) {
  return getResend().emails.send({
    from: FROM, to: email, subject: `You have been invited to join ${organisationName} on Migrait`,
    html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px"><h1 style="color:#0A0E1A;font-size:28px;font-weight:900;margin-bottom:8px">You have been invited.</h1><p style="color:#6B7A8D;font-size:16px;line-height:1.7"><strong style="color:#0A0E1A">${inviterName}</strong> has invited you to join <strong style="color:#0A0E1A">${organisationName}</strong> on Migrait as a ${role}.</p><a href="${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}" style="display:inline-block;margin-top:24px;padding:14px 28px;background:#E11D48;color:#fff;text-decoration:none;border-radius:100px;font-weight:700;font-size:15px">Accept invitation</a><p style="color:#6B7A8D;font-size:13px;margin-top:40px">If you did not expect this invitation you can ignore this email. Migrait — Migration, Accelerated.</p></div>`
  })
}

export async function sendWaitlistConfirmationEmail(email: string) {
  return getResend().emails.send({
    from: FROM, to: email, subject: 'You are on the Migrait waitlist',
    html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px"><h1 style="color:#0A0E1A;font-size:28px;font-weight:900;margin-bottom:8px">You are on the list.</h1><p style="color:#6B7A8D;font-size:16px;line-height:1.7">Thanks for joining the Migrait waitlist. We are onboarding consultancies now and will be in touch soon with your early access invite.</p><p style="color:#6B7A8D;font-size:16px;line-height:1.7">Migrait moves 5 million records in under 2 hours. With a live dashboard your client can watch in real time.</p><p style="color:#6B7A8D;font-size:13px;margin-top:40px">Migrait — Migration, Accelerated.</p></div>`
  })
}

export async function sendDemoRequestConfirmationEmail(email: string, name: string) {
  return getResend().emails.send({
    from: FROM, to: email, subject: 'Demo request received — Migrait',
    html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px"><h1 style="color:#0A0E1A;font-size:28px;font-weight:900;margin-bottom:8px">Request received, ${name}.</h1><p style="color:#6B7A8D;font-size:16px;line-height:1.7">We have received your demo request and will be in touch within 1 business day to schedule a 30-minute call. You will see Migrait run a live migration on your actual data.</p><p style="color:#6B7A8D;font-size:13px;margin-top:40px">Migrait — Migration, Accelerated.</p></div>`
  })
}
