import * as path from "node:path";
import multer from "multer"; 
import * as crypto from "node:crypto"

const storage = multer.diskStorage({
    destination(req, file, cb) {
        console.log(path.join(process.cwd(), "tmp"));
        cb(null, path.join(process.cwd(), "tmp"));
    },
    filename(req, file, cb) {
        const extname = path.extname(file.originalname); // file extension
        const basename = path.basename(file.originalname, extname); // file name
        const suffix = crypto.randomUUID();

        cb(null, `${basename}-${suffix}${extname}`);
    },
});

export default multer({ storage });