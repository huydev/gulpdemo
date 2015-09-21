//引入gulp
var gulp = require('gulp');
var useref = require('gulp-useref');

var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

var sass = require('gulp-ruby-sass');

var imagemin = require('gulp-imagemin');

var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var connect = require('gulp-connect');

var clean = require('gulp-clean');

//引入组件
/*var plugins = require('gulp-load-plugins')({
	rename: {
		'gulp-ruby-sass': 'sass'
	}
});*/

gulp.task('useref', function(){
	var assets = useref.assets();
	return gulp.src('test/*.html')
		.pipe(assets)
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest('dest'));
});

gulp.task('minifyCss', function(){
	return gulp.src('dest/css/*.css')
		.pipe(minifyCss())
		.pipe(gulp.dest('dest/css'));
});

gulp.task('sass', function(){
	return sass('test/sass/*.scss')
		.on('error', sass.logError)
		.pipe(gulp.dest('test/css'));
});

gulp.task('uglify', function(){
	return gulp.src('dest/js/*js')
		.pipe(uglify())
		.pipe(gulp.dest('dest/js'));
});

gulp.task('imagemin', function(){
	return gulp.src('test/img/**/*.{png,jpg,gif,ico}')
		.pipe(imagemin({
			progressive: true	//jpg 无损压缩
		}))
		.pipe(gulp.dest('dest/img'));
});

gulp.task('autoprefix', ['sass'], function(){
	return gulp.src('test/css/*.css')
		.pipe(autoprefixer({
			browsers: ['> 5% in CN']
		}))
		.pipe(gulp.dest('test/css'))
		.pipe(connect.reload());
});

gulp.task('jshint', function(){
	return gulp.src('test/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(connect.reload());
});

gulp.task('clean', function(){
	gulp.src('dest', {read: false})
		.pipe(clean());
});

// watch
gulp.task('watch', function(){
	gulp.watch(['test/*.html'], function(event){
		gulp.src('test/*.html')
			.pipe(connect.reload());
	});
	
	gulp.watch(['test/sass/*.scss'], ['autoprefix']);
	
	gulp.watch(['test/js/*.js'], ['jshint']);
	
	gulp.watch(['test/img/*'], function(event){
		gulp.src('test/*.html')
			.pipe(connect.reload());
	});

});

gulp.task('connect', function(){
	connect.server({
		root: 'test',
		port: 9000,
		livereload: true
	});
});

gulp.task('default', ['connect', 'watch']);
gulp.task('build', ['clean', 'useref'], function(){
	gulp.run('minifyCss');
	gulp.run('uglify');
	gulp.run('imagemin');
});