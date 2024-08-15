import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import sendErrorResponse from "../utils/errorResponse";

// Set storage engine
const storage = multer.diskStorage({
	destination: "./public/uploads",
	filename: (
		req: any,
		file: { fieldname: any; originalname: string },
		cb: (arg0: null, arg1: string) => void
	) => {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		);
	},
});

// Initialize upload
const upload = multer({
	storage,
	limits: { fileSize: 1000000 }, // 1MB file size limit
	fileFilter: (req: any, file: any, cb: any) => {
		const filetypes = /jpeg|jpg|webp|png/;
		const extname = filetypes.test(
			path.extname(file.originalname).toLowerCase()
		);
		const mimetype = filetypes.test(file.mimetype);

		if (extname && mimetype) {
			return cb(null, true);
		} else {
			cb(new Error("Only images are allowed"));
		}
	},
});

// Middleware to handle upload errors
const single =
	(name: string) => (req: Request, res: Response, next: NextFunction) => {
		upload.single(name)(req, res, (err: any) => {
			if (err) {
				// Multer error handling
				if (err instanceof multer.MulterError) {
					// A Multer error occurred when uploading.
					res.status(400).json({ error: err.message });
				} else {
					// An unknown error occurred when uploading.
					res.status(400).json({ error: err.message });
				}
			} else {
				// Everything went fine
				next();
			}
		});
	};
const any = () => (req: Request, res: Response, next: NextFunction) => {
	upload.any()(req, res, (err: any) => {
		if (err) {
			// Multer error handling
			if (err instanceof multer.MulterError) {
				// A Multer error occurred when uploading.
				sendErrorResponse(res, 400, err.message);
			
			} else {
				// An unknown error occurred when uploading.
        sendErrorResponse(res, 400, err.message);
			}
		} else {
			// Everything went fine
			next();
		}
	});
};

const uploadMiddleware = { single, any };
export default uploadMiddleware;
