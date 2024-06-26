import { Request, Response } from 'express';

// write a controller function for home
export const homeController = (req: Request, res: Response) => {
    // Your code here
    res.send('Welcome to the home page!');
};