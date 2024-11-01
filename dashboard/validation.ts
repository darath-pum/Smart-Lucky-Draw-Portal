export function validatePhone(phone?: string): string | undefined {
  if (!phone) return "is required";
  if (phone.length > 8) return "Phone must be at least 8 characters";
}
export function validatePassword(password?: string): string | any {
  if (!password) {
    return "is required";
  }

  const lowercaseRegex = /[a-z]/;
  const uppercaseRegex = /[A-Z]/;
  const numberRegex = /\d/;
  const specialCharRegex = /[@$!%*?&]/;

  const isLengthValid = password.length >= 8;
  const hasLowercase = lowercaseRegex.test(password);
  const hasUppercase = uppercaseRegex.test(password);
  const hasNumber = numberRegex.test(password);
  const hasSpecialChar = specialCharRegex.test(password);

  const errors:any = {};
  if (isLengthValid) {
    errors.passwordlength = true;
  }
  if (hasLowercase) {
    errors.lowercaseRegex = true;
  }
  if (hasUppercase) {
    errors.uppercaseRegex = true;
  }
  if (hasNumber) {
    errors.numberRegex = true;
  }
  if (hasSpecialChar) {
    errors.specialCharRegex = true;
    
  }

  if (Object.keys(errors).length === 0) {
    return "is valid";
  } else {
    return errors;
  }
}

export function validateEmail(email?: string): string | undefined {
  if (!email) return "is required";
  if (!/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email))
    return "Email is invalid";
}

export function validateFile(file?: File): string | undefined {
  if (!file) return "is required";

  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  if (!fileExtension || fileExtension !== "csv") {
    return "Invalid file type. Only CSV files are allowed";
  }
}

export function validateImage(image?: File): string | undefined {
  if (!image) return "is required";
  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "tiff", "avif"]; // Add more image extensions if needed
  const fileExtension = image.name.split(".").pop()?.toLowerCase();
  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    return "Invalid file type. Only image files are allowed.";
  }
  // Additional validation or processing logic can be added here if needed
}

export function validateCampaignName(
  campaign_name?: String
): string | undefined {
  if (!campaign_name) return "Campaign name is required";
}

export function validateDate(date?: string): string | undefined {
  if (!date) return "is required";
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(date))
    return "Invalid date format. Please use the format YYYY-MM-DD";
  return;
}
export function validFirstName(first_name: any): string | undefined {
  if (!first_name) return "is required";
}
export function validLastName(last_name: any): string | undefined {
  if (!last_name) return "is required";
}

export function validateRole(role: any): string | undefined {
  if (!role) return "is required";
}