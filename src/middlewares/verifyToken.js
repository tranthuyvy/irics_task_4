import JWT from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        if (req?.headers?.authorization?.startsWith('Bearer')) {
            const token = req.headers.authorization.split(' ')[1];
            JWT.verify(token, process.env.JWT_SECRET_KEY, (error, decode) => {
                if (error) {
                    return res.status(401).json({
                        success: false,
                        mes: 'Invalid access token',
                    });
                }
                req.user = decode;
                next();
            });
        } else {
            return res.status(401).json({
                success: false,
                mes: 'Require authentication!',
            });
        }
    } catch (error) {
        console.error(error);
    }
};
