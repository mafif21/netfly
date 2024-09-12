import {validate} from "../validation/validation.js";
import {
    createFilmValidation,
    getFilmValidation, searchFilmValidation,
    updateFilmValidation
} from "../validation/film-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";

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

    const totalFilmInDatabase = await prismaClient.film.count({
        where: {
            id: film.id
        }
    });

    if (totalFilmInDatabase !== 1) {
        throw new ResponseError(404, "film is not found");
    }

    return prismaClient.film.update({
        where: {
            id: film.id
        },
        data: {
            title: film.title,
            description: film.description,
            image: film.image,
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

    const totalInDatabase = await prismaClient.film.count({
        where: {
            id: filmId
        }
    });

    if (totalInDatabase !== 1) {
        throw new ResponseError(404, "film is not found");
    }

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
