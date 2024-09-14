import filmService from "../service/film-service.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const create = async (req, res, next) => {
    try {
        const request = req.body;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const newFilmData = {
            ...request,
            image: req.files.image
        };

        const result = await filmService.create(newFilmData);
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

        let imageFile = null;
        if (req.files && req.files.image) {
            imageFile = req.files.image;
        }

        request.image = imageFile ? imageFile : null;

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
