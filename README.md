# ctos

a tool to transform component package to [spm@3x](http://www.spmjs.io/).

`由于 spm3x 暂不支持 * 作为依赖的版本号，所以有依赖但依赖不在 deps.json 里的暂不能用此工具转换。`

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

# transform using sock5 proxy
$ ctos --proxy localhost:8387 visionmedia/page.js
```

## LISENCE

(MIT License)

Copyright (c) 2014 ChenCheng sorrycc@gmail.com

