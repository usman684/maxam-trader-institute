import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET })
const ok = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (r, f, cb) => ok.includes(f.mimetype) ? cb(null, true) : cb(new Error('Only JPG, PNG, WEBP or PDF up to 4MB')) })
export const toCloud = (file, folder) => new Promise((res, rej) => {
  if (!file) return res(undefined)
  cloudinary.uploader.upload_stream({ folder: `maxam/${folder}`, resource_type: 'auto' }, (e, r) => e ? rej(e) : res(r.secure_url)).end(file.buffer)
})
