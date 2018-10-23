# ngx-schematics-for-storybook

Angular schematics which automatically adds new components created with `ng generate component` to the [Storybook](https://storybook.js.org/).

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Downloads](https://img.shields.io/npm/dm/ngx-schematics-for-storybook.svg)](https://www.npmjs.com/package/ngx-schematics-for-storybook)

## Setup

```sh
$ npm installngx-schematics-for-storybook @storybook/cli --save-dev 
$ npx getstorybook

# yarn
$ yarn add ngx-schematics-for-storybook @storybook/cli --dev
$ yarn run getstorybook
```

Note that you need @storybook/cli>=4.0.0-alpha.9 for angular-cli 6 support.

## Configure

To use ngx-schematics-for-storybook as the default collection in your Angular CLI project, add it to your angular.json:

```sh
ng config cli.defaultCollection ngx-schematics-for-storybook
```

The ngx-schematics-for-storybook extend the default @schematics/angular collection. If you want to set defaults for schematics such as generating components with scss file, you must change the schematics package name from @schematics/angular to ngx-schematics-for-storybook in angular.json:

```json
"schematics": {
  "ngx-schematics-for-storybook:component": {
    "styleext": "scss"
  }
}
```

## Usage

```sh
# if you use ngx-schematics-for-storybook as the default collection
$ ng generate component foo
CREATE src/app/foo/foo.component.scss (0 bytes)
CREATE src/app/foo/foo.component.html (22 bytes)
CREATE src/app/foo/foo.component.spec.ts (607 bytes)
CREATE src/app/foo/foo.component.ts (258 bytes)
CREATE src/stories/foo/foo.stories.ts (376 bytes)
UPDATE src/app/app.module.ts (481 bytes)

# if you do not use ngx-schematics-for-storybook as the default collection
$ ng generate ngx-schematics-for-storybook:component foo 
```

In addition to the ordinary [`ng generate component`](https://github.com/angular/angular-cli/wiki/generate-component), the above command generates a `.stories.ts` file for the created component.

All the options for the ordinary `ng generate component` is available, as well as:

- `--noStory`
  - Skips creating a story for the created component
- `--useTemplate`
  - Uses a template string (e.g. ``template: `<app-foo></app-foo>` ``) instead of a component class (e.g. `component: FooComponent`) in the storybook
- `--tagAsLabel`
  - Uses a tag string (e.g. `<app-foo>`) as a label instead of a component class name (e.g. `FooComponent`) in the storybook
- `--replacePath`
  - Replaces the path of the story with a stringified array of `{ from: string, to: string }` which is to be used as `path.replace(new RegExp(from), to)`
- `--useComponentDir`
  - Use the same dir as the component instead of the stories dir

# License

MIT

[travis-image]:https://travis-ci.org/kimamula/ngx-schematics-for-storybook.svg?branch=master
[travis-url]:https://travis-ci.org/kimamula/ngx-schematics-for-storybook
[npm-image]:https://img.shields.io/npm/v/ngx-schematics-for-storybook.svg?style=flat
[npm-url]:https://npmjs.org/package/ngx-schematics-for-storybook