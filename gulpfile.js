const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require ('gulp-clean-css');
const uglify = require ('gulp-uglify');
const del = require ('del');
const browserSync = require('browser-sync').create();
const gcmq = require('gulp-group-css-media-queries');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

const jsFiles = [
	'./src/js/main.js'
];

function styles(){
	return gulp.src('./src/sass/main.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('app.css'))
		.pipe(gcmq())
		.pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
        	level: 2
        }))
		.pipe(gulp.dest('./build/css'))
		.pipe(browserSync.stream());
}

function scripts(){
	return gulp.src(jsFiles)
		.pipe(concat('app.js'))
		.pipe(babel({
            'presets': ['@babel/preset-env']
        }))
		.pipe(uglify({
			toplevel: true
		}))
		.pipe(gulp.dest('./build/js'))
		.pipe(browserSync.stream());
	
}

function img(){
	return gulp.src('src/img/**/*')
	.pipe(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une: [pngquant()]
	}))
	.pipe(gulp.dest('build/img'));
}

function watch(){
	browserSync.init({
        server: {
            baseDir: "./"
        },
        notify: false        
        // tunnel: true   
    });

	gulp.watch('./src/sass/**/*.sass', styles);
	gulp.watch('./src/js/**/*.js', scripts); 
	gulp.watch('./*.html').on('change', browserSync.reload);
}

function clean(){
	return del(['build/*']);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('img', img);
gulp.task('watch', watch);
gulp.task('clean', clean);

gulp.task('build', gulp.series(clean, img,
						gulp.parallel('styles', 'scripts')
						));

gulp.task('dev', gulp.series('build', 'watch'));

