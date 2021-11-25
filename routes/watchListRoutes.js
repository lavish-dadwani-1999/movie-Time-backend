const {Router} = require("express")
const WatchList = require("../models/WatchList") 
const Auth = require("../middleware/auth")
const router = Router()

router.get("/user/watchList",Auth, async (req,res)=>{
    try{
        const user = req.user
        const watchList = await WatchList.find({ userId:user._id})
        if(!watchList) return res.status(401).json({message:"no watchList" ,status:401})
        else return res.status(200).json(watchList)
    }catch(err){
        console.log(err)
        res.status(500).send({message:"server Error",status:500})
    }
})


router.post("/user/addToWatchList", Auth, async (req,res)=>{
    try{
        const {movieId,movieObj} = req.body
        // console.log(req.body)
        if(!movieId || !movieObj) return res.status(404).send({message:"filed required",status:404})
        const user = req.user
        const find = await WatchList.findOne({movieId:movieId,userId:user._id})
        console.log(find)
        if(find != null) return res.status(404).send({message:"movie already added"})
        else {
            const watchlist = new WatchList({movieId,movieObj,userId:user._id})
            await watchlist.save()
            res.status(200).json({message:"added ToWatchList ",status:200})
        }
    }catch(err){
        console.log(err)
        res.status(500).send({message:"server error",status:500})
    }
})

// router.post("/user/removeWatchList/:movieId", Auth, async (req,res)=>{
//     try{
//         const user = req.user
//         const movieId  = req.params.movieId
//         if(!movieId) return res.status(404).send("movie Id required")
//         const watchList = await WatchList.find({ userId:user._id})
//         res.json(watchList)
//     }catch(err){

//     }
// })

router.delete("/user/removeWatchList/:movieId", Auth, async (req,res)=>{
    try{
        const user = req.user
        const movieId  = req.params.movieId
        const movieDelete = await WatchList.findOneAndDelete({movieId:movieId,userId:user._id})
        if(!movieDelete) res.status(404).send({message:"delete Error"})
        res.status(201).send({message:"watchList deleted"})
    }catch(err){
        console.log(err)
        if(err)return res.status(500).send({message:"server error"})
    }
})


module.exports = router