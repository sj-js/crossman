/***************************
 * Load Gulp Plugin
 *************************/
var gulp = require('gulp');
var package = require('./package.json');
// Bower
var bower = require('gulp-bower');
// plugin for js
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
// plugin for css
var csslint = require('gulp-csslint');
var concatcss = require('gulp-concat-css');
var uglifycss = require('gulp-uglifycss');
// plugin for html
var minifyhtml = require('gulp-minify-html');
// plugin
var clean = require('gulp-clean');
var stripDebug = require('gulp-strip-debug');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var webserver = require('gulp-webserver');
var livereload = require('gulp-livereload');
var shell = require('gulp-shell');



/***************************
 * Set Path
 *************************/
var src = 'src';
var dest = 'dist';
var fileSuffix = '.min';
var paths = {
	"src":{
		"js"	: [src+'/lib/**/*.js', src+'/js/**/*.js'],
		"css"	: [src+'/lib/**/*.css', src+'/css/**/*.css'],
		"res"	: src+'/res/**/*',
		"html"	: src+'/**/*.html'
	},
	"dest":{
		"js"	: dest+'/js',
		"css"	: dest+'/css',	
		"res"	: dest+'/res',
		"html"	: dest+'/'		
	}	
};



/***************************
 * Set Task
 *************************/
/** clean **/
gulp.task('clean-js', function(){
    return gulp.src(paths.dest.js)
        .pipe(clean());
});
gulp.task('clean-css', function(){
    return gulp.src(paths.dest.css)
        .pipe(clean());
});
gulp.task('clean-html', function(){
    return gulp.src(paths.dest.html)
        .pipe(clean());
});
gulp.task('clean-res', function(){
    return gulp.src(paths.dest.res)
        .pipe(clean());
});

/** js **/
gulp.task('js', ['clean-js'], function(){
    return gulp.src(paths.src.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat(package.name +'.js'))
        .pipe(gulp.dest(paths.dest.js))
        .pipe(stripDebug())
        .pipe(uglify({mangle:{toplevel:false}}))
        .pipe(rename({suffix:fileSuffix}))
        .pipe(gulp.dest(paths.dest.js));
});

/** css **/
gulp.task('css', ['clean-css'], function(){
    return gulp.src(paths.src.css)
        .pipe(csslint())
        .pipe(csslint.reporter())
        .pipe(concatcss(package.name +'.css'))
        .pipe(gulp.dest(paths.dest.css))
        .pipe(uglifycss())
        .pipe(rename({suffix:fileSuffix}))
        .pipe(gulp.dest(paths.dest.css));
});

/** res **/
gulp.task('res', ['clean-res'], function(){
    return gulp.src(paths.src.res)
        .pipe(gulp.dest(paths.dest.res));
});

/** html **/
gulp.task('html', ['clean-html'], function(){
    return gulp.src(paths.src.html)
        .pipe(minifyhtml())
        .pipe(gulp.dest(paths.dest.html));
});

/** server **/
// 웹서버를 localhost:8000 로 실행한다.
gulp.task('server', function(){
	return gulp.src(dest + '/')
		.pipe(webserver());
});



/** watch **/
// 파일 변경 감지 및 브라우저 재시작
gulp.task('watch', function () {
	livereload.listen();
	gulp.watch(paths.src.js, ['js']);
	gulp.watch(paths.src.css, ['css']);
	gulp.watch(paths.src.html, ['html']);
	gulp.watch(paths.src.res, ['res']);
	gulp.watch(dest + '/**').on('change', livereload.changed);
});


/** bower **/
gulp.task('bower-install', function(){
	return bower();
});

gulp.task('bower-update', function(){
	return bower({cmd:'update'});
});



/** shell **/
// 마지막으로 원하는 쉘을 실행!
gulp.task('shell', shell.task([
	'echo "Lets Start Development"', 	
	'start /max http://localhost:8000/'
]));
gulp.task('run', shell.task([
	'node index.js &',
	'echo "Lets Start Development"', 
	'start /max http://localhost:5000/'
]));


//기본 task 설정
gulp.task('default.bak', ['server','js','css','res','html','watch', 'shell']);
gulp.task('bower', ['bower-install','bower-update']);
gulp.task('build', ['js','css','res','html']);
gulp.task('default', ['build']);
gulp.task('start', ['run','build','watch']);
gulp.task('dev', ['js','css','res','html','watch']);