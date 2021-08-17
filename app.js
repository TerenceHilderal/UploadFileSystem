const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

const app = express();

const port = 4000;

// set storage engine

const storage = multer.diskStorage({
	destination: './public/uploads',
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + '-' + Date.now() + path.extname(file.originalname),
		);
	},
});

// init upload

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb);
	},
}).single('myImage');

const checkFileType = (file, cb) => {
	// allowed ext
	const fileTypes = /jpg|jpeg|gif|png/;
	// check extension
	const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
	// check myme type
	const mimeType = fileTypes.test(file.mimetype);

	if (extName && mimeType) {
		return cb(null, true);
	} else {
		cb('Error:only images');
	}
};

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});

// set up ejs

app.set('view engine', 'ejs');

// public folder

app.use(express.static('./public'));

app.get('/', (req, res) => {
	res.render('index');
});

app.post('/upload', (req, res) => {
	upload(req, res, (err) => {
		console.log(req.file);
		if (err) {
			res.render('index', {
				msg: err,
			});
		} else {
			if (req.file === undefined) {
				res.render('index', {
					msg: 'Error no file selected',
				});
			} else {
				res.render('index', {
					msg: 'File uploaded',
					file: `uploads/${req.file.filename}`,
				});
			}
		}
	});
});
