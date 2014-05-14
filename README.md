# ctos

a tool to transform component package to [spm@3x](http://www.spmjs.io/).

`node 0.11.x required`

## Install

```bash
$ npm install ctos -g
```

## Usage

```bash
# transform specific release
$ ctos visionmedia/page.js@1.3.4

# transform lastest release of a repo
$ ctos visionmedia/page.js

# transform lastest 2 releases of a repo
$ ctos visionmedia/page.js --count 2
```

## LISENCE

(MIT License)

Copyright (c) 2014 ChenCheng sorrycc@gmail.com

