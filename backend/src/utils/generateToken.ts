import jwt, { SignOptions } from 'jsonwebtoken';

/**
 * Generate JWT token for authentication
 * @param id - User ID
 * @returns JWT token string
 */
const generateToken = (id: string): string => {
    const options: SignOptions = {
        expiresIn: '30d',
    };

    return jwt.sign({ id }, process.env.JWT_SECRET as string, options);
};

export default generateToken;
