import * as nodemailer from 'nodemailer';
export const emailAdapter = {
	async sendEmail(email: string, subject: string, html: string) {
		const authEmail = process.env.EMAIL;
		const authPass = process.env.PASS;

		const transport = await nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: authEmail,
				pass: authPass,
			},
		});

		const info = await transport.sendMail({
			from: authEmail,
			to: email,
			subject: subject,
			html: html,
		});
		return info;
	},

	async resendEmail(email: string, subject: string, html: string) {
		const authEmail = process.env.EMAIL;
		const authPass = process.env.PASS;

		const transport = await nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: authEmail,
				pass: authPass,
			},
		});

		const info = await transport.sendMail({
			from: authEmail,
			to: email,
			subject: subject,
			html: html,
		});

		return info;
	},
};
