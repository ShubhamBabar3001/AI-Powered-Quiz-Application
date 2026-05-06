export const validateEmail = (email) => {
    if (!email) return "Email is required";

    const trimmedEmail = email.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(trimmedEmail) ? null : "Invalid email format";
};