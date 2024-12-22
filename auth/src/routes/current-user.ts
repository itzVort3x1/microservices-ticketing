import express, { Request, Response } from "express";

import { currentUser } from "@kaustubhtech/common";

const router = express.Router();

router.get(
    "/api/users/currentuser",
    currentUser,
    (req: Request, res: Response) => {
        res.status(200).send({ currentUser: req.currentUser || null });
    }
);

export { router as currentUserRouter };
