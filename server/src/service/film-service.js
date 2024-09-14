import {validate} from "../validation/validation.js";
import {
    createFilmValidation,
    getFilmValidation, searchFilmValidation,
    updateFilmValidation
} from "../validation/film-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import * as fs from "node:fs";


const imageFolderPath = path.join(process.cwd(), 'src/public/images');

const deleteOldImage = (oldImage) => {
    const oldImagePath = path.join(imageFolderPath, oldImage);
    if (oldImage && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
    }
};

const saveNewImage = async (imageFile) => {
    const uniqueFileName = `${uuidv4()}${path.extname(imageFile.name)}`;
    const uploadPath = path.join(imageFolderPath, uniqueFileName);

    await imageFile.mv(uploadPath);
    return uniqueFileName;
};

const create = async (request) => {
    const film = validate(createFilmValidation, request);

    return prismaClient.film.create({
        data: film,
        select: {
            id: true,
            title: true,
            description: true,
            image: true
        }
    });
}

const get = async (filmId) => {
    filmId = validate(getFilmValidation, filmId);

    const film = await prismaClient.film.findFirst({
        where: {
            id: filmId
        },
        select: {
            id: true,
            title: true,
            description: true,
            image: true
        }
    });

    if (!film) {
        throw new ResponseError(404, "film is not found");
    }

    return film;
}

const update = async (request) => {
    const film = validate(updateFilmValidation, request);

    const filmInDatabase = await prismaClient.film.findFirst({
        where: {
            id: film.id
        }
    });

    if (!filmInDatabase) {
        throw new ResponseError(404, "film is not found");
    }

    let newImageFileName = filmInDatabase.image;

    if (request.image) {
        newImageFileName = await saveNewImage(newImageFileName);
        const oldFilm = await prismaClient.film.findUnique({
            where: {
                id: film.id
            }
        });
        deleteOldImage(oldFilm.image);
    }

    return prismaClient.film.update({
        where: {
            id: film.id
        },
        data: {
            title: film.title,
            description: film.description,
            image: newImageFileName,
        },
        select: {
            id: true,
            title: true,
            description: true,
            image: true
        }
    })
}

const remove = async (filmId) => {
    filmId = validate(getFilmValidation, filmId);

    const findFilm = await prismaClient.film.findFirst({
        where: {
            id: filmId
        }
    });

    if (!findFilm) {
        throw new ResponseError(404, "film is not found");
    }

    deleteOldImage(findFilm.image);

    return prismaClient.film.delete({
        where: {
            id: filmId
        }
    });
}

const search = async (request) => {
    request = validate(searchFilmValidation, request);
    const skip = (request.page - 1) * request.size;

    const filters = [];

    if (request.title) {
        filters.push({
            OR: [
                {
                    title: {
                        contains: request.title,
                        mode: "insensitive"
                    }
                },
            ]
        });
    }


    const films = await prismaClient.film.findMany({
        where: {
            AND: filters
        },
        take: request.size,
        skip: skip
    });

    const totalItems = await prismaClient.film.count({
        where: {
            AND: filters
        }
    });

    return {
        data: films,
        paging: {
            page: request.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / request.size)
        }
    }
}

export default {
    create,
    get,
    update,
    remove,
    search
}
