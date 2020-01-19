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
    return gulp.src(paths.dest.js, {allowEmpty:true})
        .pipe(clean());
});
gulp.task('clean-css', function(){
    return gulp.src(paths.dest.css, {allowEmpty:true})
        .pipe(clean());
});
gulp.task('clean-html', function(){
    return gulp.src(paths.dest.html, {allowEmpty:true})
        .pipe(clean());
});
gulp.task('clean-res', function(){
    return gulp.src(paths.dest.res, {allowEmpty:true})
        .pipe(clean());
});

/** Before **/
var packageName = package.name;
var indexForSlash = packageName.indexOf('/');
var packageFileName = (indexForSlash > 0) ? packageName.substring(indexForSlash +1) : package.name;

/** js **/
gulp.task('js', function(){
    return gulp.src(paths.src.js)
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            .pipe(concat(packageFileName +'.js'))
            .pipe(gulp.dest(paths.dest.js))
            .pipe(stripDebug())
            .pipe(uglify({mangle:{toplevel:false}}))
            .pipe(rename({suffix:fileSuffix}))
            .pipe(gulp.dest(paths.dest.js));
});

/** css **/
gulp.task('css', function(){
    return gulp.src(paths.src.css)
            .pipe(csslint())
            .pipe(csslint.formatter("compact"))
            .pipe(concatcss(packageFileName +'.css'))
            .pipe(gulp.dest(paths.dest.css))
            .pipe(uglifycss())
            .pipe(rename({suffix:fileSuffix}))
            .pipe(gulp.dest(paths.dest.css));
});

/** res **/
gulp.task('res', function(){
    return gulp.src(paths.src.res)
        .pipe(gulp.dest(paths.dest.res));
});

/** html **/
gulp.task('html', function(){
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

gulp.task('clean', gulp.parallel('clean-js', 'clean-css', 'clean-html', 'clean-res'));

gulp.task('build', gulp.series('clean', gulp.parallel('js','css','res','html')));

gulp.task('default', gulp.series('build'));




gulp.task('start', gulp.series(['run','build','watch']));
gulp.task('dev', gulp.series(['js','css','res','html','watch']));