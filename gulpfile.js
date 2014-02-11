var gulp = 			require('gulp');
var gutil = 		require('gulp-util');
var browserify = 	require('gulp-browserify');
var watch = 		require("gulp-watch");
var clean = 		require('gulp-clean');
var concat = 		require("gulp-concat");
var spawn = 		require('child_process').spawn;
var fs = 			require("fs");
var jshint = 		require('gulp-jshint');
var jshintStylish = require('jshint-stylish');

// Common build operation:
// 	Take main.js, add deps, concatenate into
// 	`bundle.js` and put in build directory.
function build() {
	fs.readFile("./package.json", "utf-8", function(config) {
		var json = JSON.parse(config);

		gulp.src('./lib/main.js')
			.pipe(browserify())
			.pipe(concat("bundle.js"))
			.pipe(gulp.dest("./build"));
	});
}


// Default task: build
gulp.task('default', ['build'], function(){

});

gulp.task('test', function () {
	// Use browser based testing and not a headless WebKit
	// proxy, since PhantomJS doesn't support IndexedDB as 
	// of 1.9.x.
    spawn("open", ["test/runner.html"]);
});

gulp.task('lint', function() {
	gulp.src('lib/**/*.js')
		.pipe(jshint("./.jshintrc"))
		.pipe(jshint.reporter(jshintStylish));
});

// Watch source files and use Browserify to handle deps.
gulp.task('watch', function() {
	gulp.src("lib/**/*.js").pipe(watch(function(files) {
		return build();
	}));
});

gulp.task('build', ['clean', 'lint'], function() {
    build();
});

gulp.task('clean', function() {
	gulp.src('./build', {read: false}).pipe(clean());
});
