# markdown-it-implicit-figures-video

[![TypeScript](https://badgen.net/badge/icon/TypeScript?icon=typescript&label)](https://github.com/ItsEricWoodward/markdown-it-implicit-figures-video) [![npm version](https://badgen.net/npm/v/markdown-it-implicit-figures-video?color=purple)](https://www.npmjs.com/package/markdown-it-implicit-figures-video) [![MIT license](https://badgen.net/github/license/ItsEricWoodward/markdown-it-implicit-figures-video)](https://www.itsericwoodward.com/licenses/mit.html) [![Package Phobia](https://badgen.net/packagephobia/install/markdown-it-implicit-figures-video?color=purple)](https://packagephobia.com/result?p=markdown-it-implicit-figures-video) [![last commit](https://badgen.net/github/last-commit/ItsEricWoodward/markdown-it-implicit-figures-video?color=blue)](https://github.com/ItsEricWoodward/markdown-it-implicit-figures-video/commits/main)

[![npm install](https://nodei.co/npm/markdown-it-implicit-figures-video.png?mini=true)](https://www.npmjs.com/package/markdown-it-implicit-figures-video)

Render videos occurring by themselves in a paragraph as `<figure><video ...></figure>`, similar to [pandoc's implicit figures for images](http://pandoc.org/README.html#images).

Based on the excellent [markdown-it-implicit-figures](https://www.npmjs.com/package/markdown-it-implicit-figures) package by [Arve Seljebu](https://arve0.github.io/).

Example input:

```md
text before ![](video.mp4)

![my video](my_video.mp4 "My Awesome Video")

and it works with links:

[![](fig.png)](page.html)
```

Output (adjusted for easier reading):

```html
<p>
	text before
	<video src="video.mp4" controls class="html5-video-player">
		Your browser does not support playing HTML5 video. You can
		<a href="video.mp4" download>download the file</a> instead.
	</video>
</p>

<figure>
	<video
		src="my_video.mp4"
		title="My Awesome Video"
		controls
		class="html5-video-player"
	>
		Your browser does not support playing HTML5 video. You can
		<a href="my_video.mp4" download>download the file</a> instead. Here is a
		description of the content: my video
	</video>
</figure>

<p>and it works with links:</p>

<figure>
	<a href="page.html">
		<video src="another_video.mp4" controls class="html5-video-player">
			Your browser does not support playing HTML5 video. You can
			<a href="another_video.mp4" download>download the file</a> instead.
		</video>
	</a>
</figure>
```

...and [the tests to prove it](https://github.com/ItsEricWoodward/markdown-it-implicit-figures-video/tree/main/__tests__)!

## Requirements

- The [markdown-it-html5-media](https://www.npmjs.com/package/markdown-it-html5-media) plugin, which must be `use`d before `markdown-it-implicit-figures-video` (see [usage](#usage), below).

## Install

```console
$ npm install markdown-it-implicit-figures-video
```

## Usage

```js
import mdi from "markdown-it";
import { html5Media } from "markdown-it-html5-media";
import { implicitFiguresVideo } from "markdown-it-implicit-figures-video";

...

const md = mdi().use(html5Media);

// default options below
md.use(implicitFiguresVideo, {
    copyAttrs: false, // <figure {...videoAttrs}>
    dataType: false, // <figure data-type="video">
    figcaption: false, // adds <figcaption>, possible values
      // true || 'description' => <figcaption>description text</figcaption>
      // 'title' => <figcaption>title text</figcaption>
    tabindex: false, // <figure tabindex="1+n">...
});

const src = 'intro text ![](video.mp4)\n\n![my cool video](my_video.mp4 "This Video Rocks!")\n\nMore text';
const res = md.render(src);

console.log(res);
```

<!-- Coming Soon!
[demo as jsfiddle](https://jsfiddle.net/arve0/1kk1h6p3/4/)
-->

### Options

- `copyAttrs`: Copy attributes matching (RegExp or string) `copyAttrs` to `figure` element.

- `dataType`: Set `dataType` to `true` to add the data-type attribute to `<figure>` tag
  (resulting in `<figure data-type="video">`). This can be useful for applying special
  styling for different kind of figures.

- `figcaption`: Can be set to either a boolean or string value.

  - Set `figcaption` to `true` or `description` to put the description text in a
    `<figcaption>`-block after the image. For example, `![text](img.png)` renders to

  ```html
  <figure>
  	<img src="img.png" alt="" />
  	<figcaption>text</figcaption>
  </figure>
  ```

  - Set `figcaption` to `title` to put the title text in a `<figcaption>` after the image. For example, `![text](img.png "title")` renders to

  ```html
  <figure>
  	<img src="img.png" alt="text" />
  	<figcaption>title</figcaption>
  </figure>
  ```

- `tabindex`: Set `tabindex` to `true` to add a `tabindex` property to each
  figure, beginning at `tabindex="1"` and incrementing for each figure
  encountered.

## License

MIT © [Eric Woodward](https://www.itsericwoodward.com/)
