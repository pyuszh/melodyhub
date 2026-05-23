const musicModel = require('../models/music.model');
const albumModel = require('../models/album.model');
const { uploadFile } = require('../services/storage.service');    
const jwt = require('jsonwebtoken');

async function createMusic(req, res) {

    const {title} = req.body;
    const file = req.file;

    const result = await uploadFile(file.buffer.toString('base64'))

    const music = new musicModel({
        uri: result.url,
        title,
        artist: req.user.id,
    })
    await music.save();

    res.status(201).json({
        message: "Music created successfully",
        music: {
            id: music._id,  
            title: music.title,
            uri: music.uri,
            artist: music.artist
   
}

    })
}

async function createAlbum(req, res) {

        const {title, musics} = req.body;
        const album = new albumModel({
            title,
            musics: musics,
            artist: req.user.id,
        })    

        await album.save();

        res.status(201).json({
            message: "Album created successfully",
            album: {
                id: album._id,
                title: album.title,
                musics: album.musics,
                artist: album.artist
            }
        });

   
}

async function getAllMusics(req, res) {
    const musics = await musicModel.find().limit(10).populate('artist');

    res.status(200).json({
        message: "Musics fetched successfully",
        musics: musics
    })
          
}

async function getAllAlbums(req, res) {
    const albums = await albumModel.find().select('title artist').populate('artist','username email');

    res.status(200).json({
        message: "Albums fetched successfully",
        albums: albums
    });
}

async function getAlbumById(req, res) {

    const albumId = req.params.albumId;

    const album = await albumModel.findById(albumId).populate('musics').populate('artist','username email');
    
    res.status(200).json({
        message: "Album fetched successfully",
        album: album
    });
}


module.exports = {
    createMusic,
    createAlbum,
    getAllMusics,
    getAllAlbums,
    getAlbumById
}