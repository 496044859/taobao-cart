var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var less        = require('gulp-less');
var cleanCSS    = require('gulp-clean-css');
var uglify      = require('gulp-uglify');
var useref      = require('gulp-useref');
var gulpIf      = require('gulp-if');
var cache       = require('gulp-cache');
var del         = require('del');
var runSequence = require('run-sequence');
var htmlmin     = require('gulp-htmlmin');

// 静态服务器 + 监听 less/html 文件
gulp.task('browserSync', ['less'], function() {
    browserSync.init({
        server: "./src"
    });
});

// less编译后的css将注入到浏览器里实现更新
gulp.task('less', function() {
    return gulp.src("src/less/*.less")
        .pipe(less())
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.reload({
        		stream: true
        }));
});

gulp.task('watch', function (){
	gulp.watch('src/less/**/*.less', ['less']);
	gulp.watch("./src/**/*.*").on('change', browserSync.reload);
});

gulp.task('cssmin', function () {
    gulp.src('src/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('docmin', function(){
	return gulp.src('src/*.html')
		.pipe(useref())
		.pipe(gulpIf('js/*.js',uglify()))
		.pipe(gulpIf('css/*.css',cleanCSS()))
		.pipe(gulp.dest('dist'))
});

gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('src/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function(callback) {
	del('dist');
	return cache.clearAll(callback);
})

gulp.task('clean:dist', function(callback){
	del(['dist/**/*', '!dist/images', '!dist/images/**/*'], callback)
});

gulp.task('build', function (callback) {
	runSequence('less', 'docmin',
	    callback
	)
})

gulp.task('default', function (callback) {
	runSequence(['less','browserSync'], 'watch',
    		callback
	)
})