import { Router, type IRouter } from "express";
import healthRouter from "./health";
import redditRouter from "./reddit";

const router: IRouter = Router();

router.use(healthRouter);
router.use(redditRouter);

export default router;
