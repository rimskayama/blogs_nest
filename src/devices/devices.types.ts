export type DeviceDto = {
	ip: string;
	title: string;
	lastActiveDate: string;
	deviceId: string;
};

export class DeviceType {
	ip: string;
	title: string;
	lastActiveDate: number;
	deviceId: string;
}
