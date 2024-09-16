import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Menentukan folder upload
const uploadFolder = path.join('public', 'dokumen');

// Membuat folder jika belum ada
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Konfigurasi storage untuk Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder); // Menentukan folder untuk menyimpan file
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Ekstensi file
    const originalName = path.basename(file.originalname, ext); // Nama file tanpa ekstensi
    const timestamp = Date.now(); // Menambahkan timestamp
    // Format nama file: [originalName]_[timestamp][extension]
    const newFileName = `${originalName}_${timestamp}${ext}`;
    cb(null, newFileName); // Menyimpan file dengan nama baru
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false); // Tolak file yang bukan PDF
  }
};

// Inisialisasi Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
}).any(); // Gunakan .any() jika mengupload berbagai field

export default upload;
