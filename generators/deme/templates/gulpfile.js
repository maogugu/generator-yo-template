const path = require('path');
const gulp = require("gulp");
const rename = require('gulp-rename');
const less = require('gulp-less');
const removeComments = require('gulp-strip-css-comments');
const trim = require('gulp-remove-empty-lines');

const { src, dest } = gulp;
const rootPath = path.join(__dirname);
const node_modules = path.join(rootPath, 'node_modules');
const srcLessFiles = [
  `${rootPath}/**/*.less`,
  `!${node_modules}/**`
];

gulp.task("compileSrcLess", () => {
  return src(srcLessFiles)
    .pipe(less())
    .pipe(removeComments())
    .pipe(rename((path) => {
      path.extname = '.acss';
    }))
    .pipe(trim())
    .pipe(dest(rootPath));
})

gulp.task("compileLess", ["compileSrcLess"])


gulp.task("refresh", () => {
  gulp.watch(srcLessFiles, ["compileSrcLess"])
})

gulp.task("default", ["compileLess"])

gulp.task("watch", ["refresh", "compileLess"])