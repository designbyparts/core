var
	config = require('../config'),
	gulp = require('gulp'),
	notification = require('../utils/notification'),
	paths = require('../utils/paths'),
	bitmapPaths = paths('bitmap'),
	svgPaths = paths('svg'),
	options = config.tasks.bitmap.tinypngCompress,
	task,

	changed = require('gulp-changed'),
	path = require('path'),
	svgmin = require('gulp-svgmin'),
	tinypngCompress = require('gulp-tinypng-compress'),

	svg = function() {
		return gulp
			.src(svgPaths.src)
			.pipe(changed(svgPaths.dest))
			.pipe(svgmin())
			.pipe(gulp.dest(svgPaths.dest));
	},

	bitmap = function() {
		return gulp
			.src(bitmapPaths.src)
			.pipe(
				tinypngCompress(options)
					.on('error', notification({
						title: 'Images Error',
						message: '<%= error.message %>',
					}))
			)
			.pipe(gulp.dest(bitmapPaths.dest));
	};

options.key = options.key || process.env.TINYPNG_KEY;
options.sigFile = options.sigFile || path.join(bitmapPaths.dest, '.tinypng');

gulp.task('bitmap', bitmap);
gulp.task('svg', svg);

task = gulp.parallel('svg', 'bitmap');
gulp.task('images', task);
module.exports = task;
