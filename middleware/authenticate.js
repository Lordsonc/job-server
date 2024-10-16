import jwt from 'jsonwebtoken';
import { UnAuthenticatedError } from "../errors/index.js";

const authenticate = async (req, res, next) => {
  // Attempt to retrieve the token from cookies
  const token = req.cookies.token;
  console.log('Token:', token); // Log the token for debugging

  // Check if the token exists
  if (!token) {
    throw new UnAuthenticatedError("Authentication Invalid: No token provided");
  }

  try {
    // Verify the token using the secret key
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Decoded Payload:', payload); // Log the payload for debugging

    // Attach the userId to the request object for use in subsequent handlers
    req.user = { userId: payload.userId };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error); // Log the verification error
    throw new UnAuthenticatedError("Authentication Invalid: Token verification failed");
  }
};

export default authenticate;
