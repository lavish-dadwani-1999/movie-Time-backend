const {Router} = require("express")
const TvShow = require("../models/TvShows")
const router = Router()

router.post("/tvShow",async (req,res)=>{
    try {
        var tvShow = new TvShow({ ...req.body });
      const responce = await tvShow.save();
      res.status(201).json({ tvShow: responce });
    } catch (err) {
      if (err.name === 'ValidationError')
        return res.status(400).send(`Validation Error:${err.message}`);
      console.log(err.message);
      res.status(500).json({ message: 'server error', status: 500 });
    }
})

router.get("/allTvShows", async (req,res)=>{
    try{
        const tvShows = await TvShow.find({ })
        res.status(200).json(tvShows)
    }catch(err){
        res.status(500).send({message:"server Error",status:500})
    }
})

router.get("/tvShow/language/:language", async (req,res)=>{
    try{
        const language = req.params.language
        const tvShows = await TvShow.find({ language:language})
        res.status(200).json(tvShows)
    }catch(err){
        res.status(500).send({message:"serevr error",status:500})
    }
})

router.get("/tvShows/search/:search", async (req,res)=>{
    try{
        const search = req.params.search
        if(!search)return res.status(404).send({message:"Enter the Query"})
        const tvShows = await TvShow.find({ title:{ $regex:search, $options: "i"} })
        res.status(200).json(tvShows)
    }catch(err){
        res.status(500).send({message:"server error"})
    }
})

router.get("/tvShows/id/:showId", async (req,res)=>{
    try{
        const showId = req.params.showId
        const tvShow = await TvShow.findById(showId)
        tvShow.trending +=1
         await tvShow.save()
        res.status(200).json(tvShow)
    }catch(err){
        res.status(500).send({message:"server error",status:500})
    }
})

router.get("/tvShows/trending" ,async (req,res)=>{
    try{
        const tvShows = await TvShow.find({ }).sort({ trending: -1 })
        res.status(200).json(tvShows)
    }catch(err){
        res.status(500).send({message:"server error",status:500})
    }
})
module.exports = router