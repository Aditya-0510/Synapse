import {Router} from "express"
import { ContentModel, TagsModel } from "../db.js"
import authMiddleware from "../middleware.js";

const contentRouter = Router();
contentRouter.use(authMiddleware) 

contentRouter.get("/", async(req,res) =>{
    //@ts-ignore
    const user = req.user;
    try{
        const content = await ContentModel.find({
            userId: user.id
        }).populate("userId","name").populate("tags","title")
        if (content.length === 0) {
            return res.status(404).send({ 
                message: "No content found", success: false 
            });
        }
        else{
            res.send({
                message: "Content retrieved",
                success: true,
                content: content
            })
        }
    }
    catch(e){
        return res.send({
            message: "Error in getting content",
            success: false
        })
    }
})

contentRouter.post("/", async(req,res) =>{
    //@ts-ignore
    const user = req.user;
    const { link, type, title, tags } = req.body;
    const userId = user.id;
    
    try{
        let TagId = [];
        console.log(tags);
        for(const tag of tags){

            let existingTag = await TagsModel.findOne({ 
                title: tag
            });
            console.log(existingTag);
            if (!existingTag) {
                existingTag = await TagsModel.create({
                    title: tag
                })
                console.log("done");
            }
            TagId.push(existingTag.id);
            console.log("done");
        }
        console.log(link);
        console.log(type);
        console.log(title);
        console.log(TagId[0]);
        console.log(user);
        
        await ContentModel.create({
            link: link,
            type: type,
            title: title,
            tags: TagId,
            userId: userId
        })
        console.log("done");

        res.send({
            message: "Content succesfully added",
            success: true
        })
    }
    catch(e){
        res.send({
            message: "Error in creating content",
            success: false
        })
    }
})
contentRouter.delete("/", async(req,res) =>{
    //@ts-ignore
    const user = req.user;
    const { title } = req.body;

    try{
        const result = await ContentModel.deleteOne({
            title: title,
            userId: user.id
        })

        if (result.deletedCount === 0) {
            return res.status(404).send({ 
                message: "No content found to delete", 
                success: false 
            });
        }

        res.status(200).send({
            message: "Content successfully deleted",
            success: true
        })
    }
    catch(e){
        res.status(500).send({
            message: "Error in creating content",
            success: false
        })
    }
})

export default contentRouter