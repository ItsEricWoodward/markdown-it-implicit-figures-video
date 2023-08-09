import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";

export interface ImplicitFiguresVideoOptions {
    copyAttrs?: boolean | 'description' | 'title';
    dataType?: boolean;
    figcaption?: boolean;
    tabindex?: boolean;
}

export const implicitFiguresVideo = (md: MarkdownIt, options: ImplicitFiguresVideoOptions) => {
    options = options || {};
  
    const implicitFiguresVideo = (state: any) => {

      // Reset tabIndex on md.render()
      let tabIndex = 1;
  
      // Do not process first or last token
      for (let i = 1, l = state.tokens.length; i < l - 1; ++i) {
        const token = state.tokens[i];
  
        if (token.type !== "inline") {
          continue;
        }

        // Children: video alone, with attrs, or link_open -> video -> link_close
        if (
          !token.children || token.children.length < 1 || token.children.length > 3
        ) {
          continue;
        }

        // Just one child, should be a video
        if (token.children.length === 1 && token.children[0].type !== "video") {
          continue;
        }

        // Two children, could be output from attrs plugin
        if (token.children.length === 2 &&
          (token.children[0].type !== "video" || token.children[1].type !== "text" ||
            token.children[1].content !== "")
         ) {
          continue;
        }

        // Three children, should be a video enclosed in a link
        if (
          token.children.length === 3 &&
          (token.children[0].type !== "link_open" ||
            token.children[1].type !== "video" ||
            token.children[2].type !== "link_close")
        ) {
          continue;
        }

        // Prev token is paragraph open
        if (i !== 0 && state.tokens[i - 1].type !== "paragraph_open") {
          continue;
        }
        // Next token is paragraph close
        if (i !== l - 1 && state.tokens[i + 1].type !== "paragraph_close") {
          continue;
        }

        // We have an inline token containing just a video.
        // Previous token is paragraph open.
        // Next token is paragraph close.
        // Let's replace the paragraph tokens with figure tokens.
        var figure = state.tokens[i - 1];
        figure.type = "figure_open";
        figure.tag = "figure";
        state.tokens[i + 1].type = "figure_close";
        state.tokens[i + 1].tag = "figure";
  
        // Handle `dataType` flag
        if (options.dataType == true) {
          state.tokens[i - 1].attrPush(["data-type", "video"]);
        }

        let video;
  
        // For linked videos, video is one off
        video =
          token.children.length < 3 ? token.children[0] : token.children[1];

        // Handle `figcaption` flag
        if (options.figcaption) {
          // store string value of option for later comparison
          const captionOptionString = new String(options.figcaption).toLowerCase().trim();
  
          // Handle making figcaption from title        
          if (captionOptionString == 'title') {
            let figCaption;
            const captionObj = video.attrs?.find(([k]: [string]) => {
              return k === 'title';
            });
    
            if (Array.isArray(captionObj)) {
              figCaption = captionObj[1];
            }
    
            if (figCaption) {
              const captionArray = md.parseInline(figCaption, {});
  
              // use empty default
              let captionContent: Pick<Token, 'children'> = { children: [] };
              
              // override if the data is there
              if (Array.isArray(captionArray) && captionArray.length && captionArray[0]) {
                captionContent = captionArray[0];
              }
  
              // add figcaption
              token.children.push(
                new state.Token('figcaption_open', 'figcaption', 1)
              );
              token.children.push(...(captionContent.children ?? []));
              token.children.push(
                new state.Token('figcaption_close', 'figcaption', -1)
              );
            }
          }
  
          // Handle making figcaption from description        
          else if (options.figcaption == true || captionOptionString == 'description') {
            if (video.children && video.children.length) {
              token.children.push(
                new state.Token('figcaption_open', 'figcaption', 1)
                );
              token.children.splice(token.children.length, 0, ...video.children);
              token.children.push(
                new state.Token('figcaption_close', 'figcaption', -1)
                );
              video.children.length = 0;
            }
          }
        }

        // Handle `copyAttrs` flag
        if (options.copyAttrs && video.attrs) {
          const f = options.copyAttrs === true ? '' : options.copyAttrs
          figure.attrs = [...(figure.attrs ?? []), ...video.attrs.filter(([k]: [string]) => k.match(f))];
        }

        // Handle `tabindex` flag
        if (options.tabindex == true) {
          // add a tabindex property
          state.tokens[i - 1].attrPush(["tabindex", tabIndex]);
          tabIndex++;
        }
      }
    };
  
    md.core.ruler.before(
      "linkify",
      "implicit_figures_video",
      implicitFiguresVideo
    );
};

export default implicitFiguresVideo;
