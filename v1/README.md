[![Build Status](https://travis-ci.org/yukimura1227/reveal_lightning.svg?branch=master)](https://travis-ci.org/yukimura1227/reveal_lightning)

![Logo of the project](https://raw.githubusercontent.com/yukimura1227/reveal_lightning/development/build/icon.ico)

# reveal_lightning
simple markdown editor and http server for [reveal.js](https://github.com/hakimel/reveal.js) presentation powered by electron.  
reveal.js is cool presentation tool that good-look presentation contents could create by html and markdown.  
presentation contents like this -> [https://revealjs.com](https://revealjs.com)  
[about reveal_lightning](https://yukimura1227.github.io/try_github_pages/about_reveal_rightning/)

## Installing / Getting started

package is here ->
https://github.com/yukimura1227/reveal_lightning/releases

## Developing

### Prerequisites

yarn is required for developing.
see: https://yarnpkg.com/lang/en/docs/install/

### Setup


```shell
git clone https://github.com/yukimura1227/reveal_lightning
cd reveal_lightning
yarn
```

### Building

```shell
yarn run pack
```

### Deploying / Publishing

Using github releases function.  
package upload to here ->
https://github.com/yukimura1227/reveal_lightning/releases

#### How To Release
see: ![](https://www.electron.build/configuration/publish#recommended-github-releases-workflow)

```
export GH_TOKEN=XXXXXXXXXXX
yarn run release
```

## Features

### Start Server locally
It's start http server on 8000 port when starting reveal_lightning.app.   
So you can access presentation content on http://localhost:8000/reveal_view.html  
(you can change listen port at system preferences.)

### Appearance
![](https://raw.githubusercontent.com/yukimura1227/reveal_lightning/v1.2.6/readme_resource/area_explain.png)

### Functions
#### 1. editor area
You can edit markdown here and then the text compile and display preview area automatically.  

It allows original notation for nested html tags.  
`__{:xxxx yyyy : width: 100%; height: 100%;}__` convert `<div class="xxxx yyyy" style="width: 100%; height: 100%;>`  
and `__$__` convert `</div>`__

ex)
You can create 2 column layout by writing below.

```
__{:uk-flex}__
__{:uk-width-1-2}__
left contents
__$__


__{:uk-width-1-2}__
right contents
__$__
__$__
```

#### 2. preview area
Here is preview area.

#### 3. editor tool area
If you mouse over on the gear icon then show tool buttons.  
Tool buttons give

- direct paste image from clipboard
- add separator for change chapter
- add separator for change section
- presentation button(open system default browser)
- reload button for presentation area
- print button(open system default browser with print-pdf parameter)
- add custom element sentence(ex) &lt;!-- .element: class="fragment grow" --&gt;)

#### 4. presentation area
Presentation contents result displays here.  
If you want to reload then you hover the gear icon and click reload button.

## Future functions

- [ ] right click menu instead of gear icon.
- [ ] useful keyboard shortcut.
- [ ] image paste from file.
- [ ] using mathjax on preview area.

## Contributing
If you'd like to contribute, please fork the repository and use a feature
branch. Pull requests are warmly welcome.

## Licensing
The code in this project is licensed under MIT license.
