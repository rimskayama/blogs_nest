export type DeviceViewDto = {
	ip: string;
	title: string;
	lastActiveDate: string;
	deviceId: string;
};

export type DeviceDto = {
	ip: string;
	title: string;
	lastActiveDate: number;
	deviceId: string;
};

export class DeviceType {
	userId: string;
	ip: string;
	title: string;
	lastActiveDate: number;
	deviceId: string;
	tokenExpirationDate: number;
	static getViewDevice(deviceFromDb: DeviceType): DeviceViewDto {
		return {
			ip: deviceFromDb.ip,
			title: deviceFromDb.title,
			lastActiveDate: new Date(deviceFromDb.lastActiveDate * 1000).toISOString(),
			deviceId: deviceFromDb.deviceId,
		};
	}
}
