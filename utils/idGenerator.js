/**
 * Generates a custom ID based on the format YY<CODE>XXXX.
 * @param {string} code - The two-digit code for the entity type (e.g., '01' for Admin).
 * @param {number} min - The minimum value for the random serial number.
 * @param {number} max - The maximum value for the random serial number.
 * @returns {string} The generated custom ID.
 */
const generateCustomId = (code, min, max) => {
    const year = new Date().getFullYear().toString().slice(-2); // Get last two digits of the year
    const serialNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return `${year}${code}${serialNumber}`;
};

module.exports = { generateCustomId };