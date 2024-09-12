import filmService from "../service/film-service.js";

const create = async (req, res, next) => {
    try {
        const request = req.body;
        const result = await filmService.create(request);
        res.status(201).json({
            status: 201,
            message: "success create new data",
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const filmId = req.params.filmId;
        const result = await filmService.get(filmId);
        res.status(200).json({
            status: 200,
            message: `success get data with id ${filmId}`,
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const filmId = req.params.filmId;
        const request = req.body;
        request.id = filmId;

        const result = await filmService.update(request);
        res.status(200).json({
            status: 200,
            message: "success update existing film",
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        const filmId = req.params.filmId;

        await filmService.remove(filmId);
        res.status(200).json({
            status: 200,
            message: "success delete existing data"
        })
    } catch (e) {
        next(e);
    }
}

const search = async (req, res, next) => {
    try {
        const request = {
            title: req.query.title,
            page: req.query.page,
            size: req.query.size
        };

        const result = await filmService.search(request);
        res.status(200).json({
            status: 200,
            message: "success get all films",
            data: result.data,
            paging: result.paging
        });
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    get,
    update,
    remove,
    search
}
