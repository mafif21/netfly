import {validate} from "../validation/validation.js";
import {
    getUserValidation,
    loginUserValidation,
    registerUserValidation,
    updateUserValidation
} from "../validation/user-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {v4 as uuid} from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || 'LELEGANTENG';

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            email: user.email,
            username: user.username
        }
    });

    if (countUser === 1) {
        throw new ResponseError(400, "Email already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);


    return prismaClient.user.create({
        data: user,
        select: {
            email: true,
            username: true,
        }
    });
}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            email: loginRequest.email,
            username: loginRequest.username
        },
        select: {
            username: true,
            email: true,
            password: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "email or password wrong");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or password wrong");
    }

    const token = jwt.sign(
        {
            email: user.email,
            username: user.username,
        },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    return prismaClient.user.update({
        data: {
            token: token
        },
        where: {
            username: user.username
        },
        select: {
            token: true
        }
    });
}

const get = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            email: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return user;
}

const update = async (request) => {
    const user = validate(updateUserValidation, request);

    const totalUserInDatabase = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (totalUserInDatabase !== 1) {
        throw new ResponseError(404, "user is not found");
    }

    const data = {};
    if (user.username) {
        data.username = user.username;
    }
    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: data,
        select: {
            username: true,
            email: true
        }
    })
}

const logout = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return prismaClient.user.update({
        where: {
            username: username
        },
        data: {
            token: null
        },
        select: {
            username: true
        }
    })
}

export default {
    register,
    login,
    get,
    update,
    logout
}
