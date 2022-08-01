import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import gimage from "gulp-image";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";
import { transform } from "@babel/core";

const sass = gulpSass(dartSass);

const routes = {
  pug: {
    watch: "src/**/*",
    src: "src/*.pug",
    dest: "build",
  },
  img: {
    src: "src/img/*",
    dest: "build/img",
  },
  scss: {
    watch: "src/scss/**/*",
    src: "src/scss/style.scss",
    dest: "build/css",
  },
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/main.js",
    dest: "build/js",
  },
};

export const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

export const clean = () => del(["build"]);

const webserver = () =>
  gulp.src("build").pipe(ws({ livereload: true, open: true }));

const img = () =>
  gulp.src(routes.img.src).pipe(gimage()).pipe(gulp.dest(routes.img.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
      })
    )
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ["@babel/preset-env"] }),
          ["uglifyify", { global: true }],
        ],
      })
    )
    .pipe(gulp.dest(routes.js.dest));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles, js]);

const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);
// series : pug 함수를 실행하라
// dest : ~에 파일을 만들어라
// src : ~에 있는 파일을 가져다 써라
