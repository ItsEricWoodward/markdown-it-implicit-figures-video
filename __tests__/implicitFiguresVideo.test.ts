import mdi from "markdown-it";
const { html5Media } = require("markdown-it-html5-media");
const mdiAttrs = require("markdown-it-attrs");
import { implicitFiguresVideo } from "../src/implicitFiguresVideo";

describe('implicitFiguresVideo.ts', () => {
    let md: mdi;

	beforeEach(() => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo);
	});

	it("should add <figure> when video is by itself", () => {
		const
			src = '![my cool video](my_cool_video.mp4 "My Super Cool Video")',
			expected = [
				'<figure><video src="my_cool_video.mp4" title="My Super Cool Video" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="my_cool_video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: my cool video',
				'</video></figure>',
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});

	it("should match the example in the README", () => {
		const
			src = [
				'text before ![](video.mp4)',
				'![my video](my_video.mp4 "My Awesome Video")',
				'works with links too:',
				'[![](another_video.mp4)](page.html)',
			].join('\n\n'),
			expected = [
				'<p>text before <video src="video.mp4" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'</video></p>',
				'<figure><video src="my_video.mp4" title="My Awesome Video" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="my_video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: my video',
				'</video></figure>',
				'<p>works with links too:</p>',
				'<figure><a href="page.html"><video src="another_video.mp4" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="another_video.mp4" download>download the file</a> instead.',
				'</video></a></figure>'
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});

	it("should add <figure> when video is by itself in a paragraph", () => {
		const
			src = 'intro text ![](video.mp4)\n\n![my video](my_video.mp4 "My Awesome Video")\n\nanother paragraph',
			expected = [
				'<p>intro text <video src="video.mp4" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'</video></p>',
				'<figure><video src="my_video.mp4" title="My Awesome Video" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="my_video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: my video',
				'</video></figure>',
				'<p>another paragraph</p>',
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});

	it("should add data-type=video to figures when opts.dataType is set", () => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { dataType: true });
		const
			src = "![](video.mp4)\n",
			expected = [
				'<figure data-type="video"><video src="video.mp4" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'</video></figure>',
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});

	it("should add a figcaption based on the video description text when opts.figcaption is set", () => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { figcaption: true });
		const
			src = "![my video](video.mp4)\n",
			expected = [
				'<figure><video src="video.mp4" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: my video',
				'</video><figcaption>my video</figcaption></figure>',
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});

	it("should add a figcaption based on the video description text when opts.figcaption is set to 'description'", () => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { figcaption: 'description' });
		const
			src = '![my video](video.mp4 "my title")\n',
			expected = [
				'<figure><video src="video.mp4" title="my title" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: my video',
				'</video><figcaption>my video</figcaption></figure>',
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});

	it("should add a figcaption based on the video title text when opts.figcaption is set to title", () => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { figcaption: 'title' });
		const
			src = '![my video](video.mp4 "my title")\n',
			expected = [
				'<figure><video src="video.mp4" title="my title" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: my video',
				'</video><figcaption>my title</figcaption></figure>',
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});


	it("should not add a figcaption when there's no video description text and opts.figcaption is set", () => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { figcaption: true });
		const
			src = '![](video.mp4 "my title")\n',
			expected = [
				'<figure><video src="video.mp4" title="my title" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'</video></figure>',
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});

	it("should not add a figcaption when there's no video description text and opts.figcaption is set to 'description'", () => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { figcaption: 'description' });
		const
			src = "![](video.mp4)\n",
			expected = [
				'<figure><video src="video.mp4" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'</video></figure>',
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});

	it("should not add a figcaption when there's no video title text and opts.figcaption is set to title", () => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { figcaption: 'title' });
		const
			src = '![description](video.mp4)\n',
			expected = [
				'<figure><video src="video.mp4" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: description',
				'</video></figure>',
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});


	it("should add a figcaption based on each video's description when opts.figcaption is set", () => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { figcaption: true });
		const
			src = "![my video](video.mp4)\n\n![another video](video_2.mp4)",
			expected = [
				'<figure><video src="video.mp4" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: my video',
				'</video><figcaption>my video</figcaption></figure>',
				'<figure><video src="video_2.mp4" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video_2.mp4" download>download the file</a> instead.',
				'Here is a description of the content: another video',
				'</video><figcaption>another video</figcaption></figure>',
			
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});

	it("should add a figcaption based on each video's description when opts.figcaption is set to 'description'", () => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { figcaption: 'description' });
		const
			src = "![my video](video.mp4)\n\n![another video](video_2.mp4)",
			expected = [
				'<figure><video src="video.mp4" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: my video',
				'</video><figcaption>my video</figcaption></figure>',
				'<figure><video src="video_2.mp4" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video_2.mp4" download>download the file</a> instead.',
				'Here is a description of the content: another video',
				'</video><figcaption>another video</figcaption></figure>',
			
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});

	it("should add a figcaption based on each video's title when opts.figcaption is set to 'title'", () => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { figcaption: 'title' });
		const
			src = '![my video](video.mp4 "Title 1")\n\n![another video](video_2.mp4 "Title 2")',
			expected = [
				'<figure><video src="video.mp4" title="Title 1" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: my video',
				'</video><figcaption>Title 1</figcaption></figure>',
				'<figure><video src="video_2.mp4" title="Title 2" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video_2.mp4" download>download the file</a> instead.',
				'Here is a description of the content: another video',
				'</video><figcaption>Title 2</figcaption></figure>',
			
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});

	it("should add a tabindex value when opts.tabindex is set", () => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { tabindex: true });
		const
			src = '![my cool video](my_cool_video.mp4 "My Super Cool Video")',
			expected = [
				'<figure tabindex="1"><video src="my_cool_video.mp4" title="My Super Cool Video" ' +
					'controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="my_cool_video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: my cool video',
				'</video></figure>',
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});

	it("should add incremental tabindex to figures when opts.tabindex is set", () => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { tabindex: true });
		const
			src = '![my video](video.mp4 "Title 1")\n\n![another video](video_2.mp4 "Title 2")',
			expected = [
				'<figure tabindex="1"><video src="video.mp4" title="Title 1" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: my video',
				'</video></figure>',
				'<figure tabindex="2"><video src="video_2.mp4" title="Title 2" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video_2.mp4" download>download the file</a> instead.',
				'Here is a description of the content: another video',
				'</video></figure>',
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});

	it("should reset tabindex on each md.render()", function () {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { tabindex: true });
		const
			src = '![my video](video.mp4 "Title 1")\n\n![another video](video_2.mp4 "Title 2")',
			expected = [
				'<figure tabindex="1"><video src="video.mp4" title="Title 1" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: my video',
				'</video></figure>',
				'<figure tabindex="2"><video src="video_2.mp4" title="Title 2" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video_2.mp4" download>download the file</a> instead.',
				'Here is a description of the content: another video',
				'</video></figure>',
			].join('\n');
		let res = md?.render(src).trim();

		expect(res).toBe(expected);

		// render again, should produce same if resetting
		res = md.render(src).trim();

		expect(res).toBe(expected);
	});

	it("should copy attributes when opts.copyAttrs is set", () => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { copyAttrs: true });
		const
			src = '![my cool video](my_cool_video.mp4 "My Super Cool Video")',
			expected = [
				'<figure src="my_cool_video.mp4" title="My Super Cool Video"><video src="my_cool_video.mp4" ' +
					'title="My Super Cool Video" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="my_cool_video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: my cool video',
				'</video></figure>',
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});

	it("should copy attributes when opts.copyAttrs is set to 'src'", () => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { copyAttrs: 'src' });
		const
			src = '![my cool video](my_cool_video.mp4 "My Super Cool Video")',
			expected = [
				'<figure src="my_cool_video.mp4"><video src="my_cool_video.mp4" title="My Super Cool Video" ' +
					'controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="my_cool_video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: my cool video',
				'</video></figure>',
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});

	it("should add <figure> when image is by itself in a paragraph and preceded by a standalone link", () => {
		const
			src = '[![Caption](video1.mp4)](http://example.com)',
			expected = [
				'<figure><a href="http://example.com"><video src="video1.mp4" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video1.mp4" download>download the file</a> instead.',
				'Here is a description of the content: Caption',
				'</video></a></figure>',
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});


	it("should not make figures of paragraphs with text and inline code", () => {
		const
			src = "Text.\n\nAnd `code`.",
			expected = "<p>Text.</p>\n<p>And <code>code</code>.</p>\n",
			res = md.render(src);

		expect(res).toBe(expected);
	});

	it("should not make figures of paragraphs with links only", () => {
		const
			src = "[link](page.html)",
			expected = '<p><a href="page.html">link</a></p>\n',
			res = md.render(src);

		expect(res).toBe(expected);
	});

	it("should linkify captions when figcaption is set", () => {
		md = mdi({ linkify: true }).use(html5Media as mdi.PluginSimple)
			.use(implicitFiguresVideo, { figcaption: true });
		const
			src = '![www.example.com](my_cool_video.mp4 "My Super Cool Video")',
			expected = [
				'<figure><video src="my_cool_video.mp4" title="My Super Cool Video" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="my_cool_video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: www.example.com',
				'</video><figcaption><a href="http://www.example.com">www.example.com</a></figcaption></figure>\n',
			].join('\n'),
		res = md.render(src);

		expect(res).toBe(expected);
	});

	it("should linkify captions when figcaption is set to 'description'", () => {
		md = mdi({ linkify: true }).use(html5Media as mdi.PluginSimple)
			.use(implicitFiguresVideo, { figcaption: 'description' });
		const
			src = '![www.example.com](my_cool_video.mp4 "My Super Cool Video")',
			expected = [
				'<figure><video src="my_cool_video.mp4" title="My Super Cool Video" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="my_cool_video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: www.example.com',
				'</video><figcaption><a href="http://www.example.com">www.example.com</a></figcaption></figure>\n',
			].join('\n'),
		res = md.render(src);

		expect(res).toBe(expected);
	});

	it("should linkify captions when figcaption is set to 'title'", () => {
		md = mdi({ linkify: true }).use(html5Media as mdi.PluginSimple)
			.use(implicitFiguresVideo, { figcaption: 'title' });
		const
			src = '![Caption](my_cool_video.mp4 "www.example.com")',
			expected = [
				'<figure><video src="my_cool_video.mp4" title="www.example.com" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="my_cool_video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: Caption',
				'</video><figcaption><a href="http://www.example.com">www.example.com</a></figcaption></figure>\n',
			].join('\n'),
		res = md.render(src);

		expect(res).toBe(expected);
	});

	it("should work with markdown-it-attrs", () => {
		md = mdi().use(mdiAttrs).use(html5Media as mdi.PluginSimple)
			.use(implicitFiguresVideo, { figcaption: 'title' });
		const
			src = "![](video.mp4){.asdf}",
			expected = [
				'<figure class="asdf"><video src="video.mp4" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'</video></figure>\n',
			
			].join('\n'),
			res = md.render(src);

		expect(res).toBe(expected);
	});

	it('should keep structured markup inside caption (event if not supported in description)', () => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { figcaption: 'description' });
		const
			src = "![Video from [source](to)](video.mp4)",
			expected = [
				'<figure><video src="video.mp4" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: Video from [source](to)',
				'</video><figcaption>Video from <a href="to">source</a></figcaption></figure>\n',
			].join('\n'),
			res = md.render(src);

		expect(res).toBe(expected);
	});


	it('should keep structured markup inside caption (event if not supported in "title" attribute)', () => {
		md = mdi().use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { figcaption: 'title' });
		const
			src = '![](video.mp4 "Video from [source](to)")',
			expected = [
				'<figure><video src="video.mp4" title="Video from [source](to)" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'</video><figcaption>Video from <a href="to">source</a></figcaption></figure>\n',
			].join('\n'),
			res = md.render(src);

		expect(res).toBe(expected);
	});

	it("should copy attributes from video to figure tag", function () {
		md = mdi().use(mdiAttrs).use(html5Media as mdi.PluginSimple).use(implicitFiguresVideo, { copyAttrs: "^title$" });
		const
			src = '![caption](video.mp4 "Video 1"){.cls attr=val}',
			expected = [
				'<figure class="cls" attr="val" title="Video 1"><video src="video.mp4" title="Video 1" ' +
					'controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: caption',
				'</video></figure>\n',
			].join('\n'),
			res = md.render(src);

		expect(res).toBe(expected);
	});

	it("should render correctly with *the works*", () => {
		md = mdi({ linkify: true }).use(mdiAttrs).use(html5Media as mdi.PluginSimple)
			.use(implicitFiguresVideo, { copyAttrs: true, dataType: true, figcaption: 'title', tabindex: true });
		const
			src = '![A video](video.mp4 "www.example.com"){.vid1 attr1=val1}\n\n![Another video](video_2.mp4 "Title 2"){.vid2 attr1=val2}',
			expected = [
				'<figure class="vid1" attr1="val1" data-type="video" src="video.mp4" title="www.example.com" ' +
					'tabindex="1"><video src="video.mp4" title="www.example.com" controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video.mp4" download>download the file</a> instead.',
				'Here is a description of the content: A video',
				'</video><figcaption><a href="http://www.example.com">www.example.com</a></figcaption></figure>',
				'<figure class="vid2" attr1="val2" data-type="video" src="video_2.mp4" ' +
					'title="Title 2" tabindex="2"><video src="video_2.mp4" title="Title 2" ' +
					'controls class="html5-video-player">',
				'Your browser does not support playing HTML5 video.',
				'You can <a href="video_2.mp4" download>download the file</a> instead.',
				'Here is a description of the content: Another video',
				'</video><figcaption>Title 2</figcaption></figure>',
			].join('\n'),
			res = md?.render(src).trim();

        expect(res).toBe(expected);
	});

})