import { CustomRequest } from "@src/types";
import client from "@src/config/db";

const createJob = async (req: CustomRequest, res: Response) => {
    const { command, description } = req.value;
    // const job = await client.jobs.create({ data: {command} });
    // res.status(201).json(job);
};

export default { createJob };