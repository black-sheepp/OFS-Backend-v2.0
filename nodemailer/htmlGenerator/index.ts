import { EmailData } from "../../utils/interface";
import { generateCreateNotificationEmailToAdminHtml } from "./functionality/CreateNotificationEmailToAdmin";
import { generateDeleteNotificationEmailToAdminHtml } from "./functionality/DeleteNotificationEmailToAdmin";
import { generateLoginNotificationHtml } from "./functionality/loginNotification";
import { generateLogoutNotificationHtml } from "./functionality/LogoutNotification";
import { generateNewAccountCreatedHtml } from "./functionality/newAccountCreated";
import { generateOrderCancelledHtml } from "./functionality/orderCancelled";
import { generateOrderPlacedHtml } from "./functionality/orderPlaced";
import { generatePasswordChangedHtml } from "./functionality/PasswordChanged";
import { generatePasswordResetRequestHtml } from "./functionality/passwordResetRequest";
import { generatePasswordResetSuccessfulHtml } from "./functionality/passwordResetSuccessful";
import { generateProfileUpdatedHtml } from "./functionality/profileUpdated";
import { generateReadNotificationEmailToAdminHtml } from "./functionality/ReadNotificationEmailToAdmin";

// Function to generate HTML content based on email type
export const generateHtmlContent = ({ greeting, intro, details, footer, type }: Omit<EmailData, "to" | "subject">): string => {
	switch (type) {
		case "NewAccountCreated":
			return generateNewAccountCreatedHtml(greeting, intro, details, footer);
		case "ProfileUpdated":
			return generateProfileUpdatedHtml(greeting, intro, details, footer);
		case "PasswordChanged":
			return generatePasswordChangedHtml(greeting, intro, details, footer);
		case "PasswordResetRequest":
			return generatePasswordResetRequestHtml(greeting, intro, details, footer);
		case "PasswordResetSuccessful":
			return generatePasswordResetSuccessfulHtml(greeting, intro, details, footer);
		case "OrderPlaced":
			return generateOrderPlacedHtml(greeting, intro, details, footer);
		case "OrderCancelled":
			return generateOrderCancelledHtml(greeting, intro, details, footer);
		case "LoginNotification":
			return generateLoginNotificationHtml(greeting, intro, details, footer);
		case "LogoutNotification":
			return generateLogoutNotificationHtml(greeting, intro, details, footer);
        case "CreateNotificationEmailToAdmin":
            return generateCreateNotificationEmailToAdminHtml(greeting, intro, details, footer);
        case "ReadNotificationEmailToAdmin":
            return generateReadNotificationEmailToAdminHtml(greeting, intro, details, footer);
        case "UpdateNotificationEmailToAdmin":
            return generateReadNotificationEmailToAdminHtml(greeting, intro, details, footer);
        case "DeleteNotificationEmailToAdmin":
            return generateDeleteNotificationEmailToAdminHtml(greeting, intro, details, footer);
		default:
			throw new Error("Unknown email type"); // Throw an error if email type is unknown
	}
};
