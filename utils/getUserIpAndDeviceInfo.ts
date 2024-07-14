import { Request } from "express";
import UAParser from "ua-parser-js";

export const getUserIpAndDeviceInfo = (req: Request) => {
	// Get user's IP address
	const ip = req.ip || req.connection.remoteAddress;

	// Parse user's device information
	const parser = new UAParser(req.headers["user-agent"]);
	const browser = parser.getBrowser();
	const os = parser.getOS();
	const device = parser.getDevice();

	const deviceInfo = `Browser: ${browser.name}, ${browser.version} | Device: ${device.vendor || "Unknown"}, ${
		device.model || "Unknown"
	} | OS: ${os.name}, ${os.version}`;

	return { ip, deviceInfo };
};
