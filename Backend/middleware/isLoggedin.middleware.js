import jwt, { decode } from 'jsonwebtoken'

export const isLoggedin = async (req, res, next) => {
    let token = await req.cookies.token;

    if (!token) {
        return res.status(401).json(
            {
                success: false,
                message: "First you login"
            }
        )
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json(
            {
                success: false,
                message: "Inavlid token"
            }
        )

    }
}