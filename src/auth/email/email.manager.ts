import { emailAdapter } from './email.adapter';
export const emailManager = {
	async sendRegistrationEmail(email: string, confirmationCode: string) {
		const subject = 'confirmation message';
		const html = `<h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
    <a href="https://somesite.com/confirm-email?code=${confirmationCode}">complete registration</a>
</p>`;
		await emailAdapter.sendEmail(email, subject, html);
	},

	async resendEmail(email: string, confirmationCode: string) {
		const subject = 'resend confirmation message';
		const html = `<h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
    <a href="https://somesite.com/confirm-email?code=${confirmationCode}">complete registration</a>
</p>`;
		await emailAdapter.resendEmail(email, subject, html);
	},

	async sendPasswordRecoveryEmail(email: string, recoveryCode: string) {
		const subject = 'password recovery message';
		const html = `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
      </p>`;
		await emailAdapter.sendEmail(email, subject, html);
	},
};
