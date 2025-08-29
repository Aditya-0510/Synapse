import Router from "express";
import authMiddleware from "../middleware.js";
import { ContentModel, LinkModel, UserModel } from "../db.js";
import { Random } from "../utils.js";
const shareRouter = Router();
shareRouter.get("/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    try {
        const link = await LinkModel.findOne({
            hash: hash
        });
        if (!link) {
            return res.status(411).json({
                message: "link doesn't exist"
            });
        }
        const content = await ContentModel.find({
            userId: link.userId
        });
        const user = await UserModel.findOne({
            _id: link.userId
        });
        if (!user) {
            return res.json({
                message: "user is not found"
            });
        }
        res.json({
            name: user.name,
            content: content,
        });
    }
    catch (e) {
        res.json({
            message: 'error occured'
        });
    }
});
shareRouter.use(authMiddleware);
shareRouter.post("/share", async (req, res) => {
    //@ts-ignore
    const user = req.user;
    const { share } = req.body;
    try {
        if (share) {
            const existingLink = await LinkModel.findOne({
                userId: user.id
            });
            if (existingLink) {
                return res.json({
                    hash: existingLink.hash
                });
            }
            const hash = Random(10);
            await LinkModel.create({
                hash: hash,
                userId: user.id
            });
            res.json({
                hash: hash
            });
        }
        else {
            await LinkModel.deleteOne({
                userId: user.id
            });
            res.json({
                message: "link deleted"
            });
        }
    }
    catch (e) {
        res.json({
            message: "cannot update link"
        });
    }
});
export default shareRouter;
//# sourceMappingURL=share.js.map