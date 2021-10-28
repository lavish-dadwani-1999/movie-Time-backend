const Movie = require("../models/Movie")
const {Router, request} = require("express")
const {get} = require("../controllers/userController")
const {get1 } = require("../controllers/movieControllers")
const Auth = require("../middleware/auth")
const router = Router()

router.post("/movies",get1.postMovies)

router.get("/allMovies",async (req,res)=>{
    try{
        const movie = await Movie.find({ })
        res.status(200).json(movie)
    }catch(err){
        res.status(500).send({message:"server Error",status:500})
    }
})

router.get("/moviesByPage", async(req,res)=>{
    try {
        const page = req.query.page 
        const limit = req.query.limit
        if(!page || !limit) return res.status(401).send({message:"enter Query",status:401})
        const data=await Movie.find().sort({_id:-1}).limit(limit * 1).skip((page-1)*limit)
        res.status(201).json(data)
    } catch (error) {
        res.status(401).json(error)
    }
})

router.get("/movies/marvel", async(req,res)=>{
    try {
        const page = req.query.page 
        const limit = req.query.limit
        if(!page || !limit) return res.status(401).send({message:"enter Query",status:401})
        const data=await Movie.find({marvelMovie:true}).sort({_id:-1}).limit(limit * 1).skip((page-1)*limit)
        res.status(201).json(data)
    } catch (error) {
        res.status(401).json('error')
    }
})


router.get("/movies/search" , async (req,res)=>{
    try{
         const searchQuery =  req.query.q 
         console.log(typeof searchQuery)
         if(!searchQuery)return res.status(404).send("invalid query")
         const movie = await Movie.find({ title:{  $regex: searchQuery, $options: "i"}})
        res.send({movie,message:"search"})
     }catch(err){
         res.send("server error")
     }
})


router.get("/movies/:genrec",async (req,res)=>{

    try{
        const page = req.query.page 
        const limit = req.query.limit
        const genrec = req.params.genrec
        const movie = await Movie.find({genrec}).sort({_id:-1}).limit(limit * 1).skip((page-1)*limit)
        res.status(200).json(movie)
    }catch(err){
        res.status(500).send("server Error")
    }
})


router.get("/moviesAllPhase", async(req,res)=>{
    try {
        const page = req.query.page 
        const limit = req.query.limit
        const phase = parseInt(req.query.phase)
        if(!page || !limit|| !phase) return res.status(401).send({message:"enter Query",status:401})
        const data=await Movie.find({"movie.phase":phase}).sort({_id:-1}).limit(limit * 1).skip((page-1)*limit)
        res.status(201).json(data)
    } catch(err) {
        console.log(err)
        res.status(500).send("error")
    }
})

// router.get("/movies/trending",async (req,res)=>{
//     try{

//     }catch(err){

//     }
// })

router.get("/moviesByLanguage", async (req,res)=>{
    try{
        const language = req.query.language
        const page = req.query.page 
        const limit = req.query.limit
        if(!page || !limit) return res.status(401).send({message:"enter Query",status:401})
        if(!language) return res.status(404).send({message:"enter the language"})
        const movie = await Movie.find({language:language}).sort({_id:-1}).limit(limit * 1).skip((page-1)*limit)
        res.status(200).json(movie)
    }catch(err){
        console.log(err)
        res.status(500).send("server error")
    }
})

router.get("/moviesFree", async (req,res)=>{
    try{
        const page = req.query.page 
        const limit = req.query.limit
        console.log("run")
        if(!page || !limit) return res.status(401).send({message:"enter Query",status:401})
        const movie = await Movie.find({isPaid:false}).sort({_id:-1}).limit(limit * 1).skip((page-1)*limit)
        res.status(200).json(movie)
    }catch(err){
        console.log(err)
        res.status(500).send("server error")
    }
})

router.get("/movie/:movieId", Auth, async (req,res)=>{
    try{
        const movieId = req.params.movieId
        const movies = await Movie.findById(movieId)
        movies.trending +=1
        await movies.save()
        res.status(200).json(movies)
    }catch(err){
        console.log(err)
        res.status(500).send("server error")
    }
})

module.exports = router