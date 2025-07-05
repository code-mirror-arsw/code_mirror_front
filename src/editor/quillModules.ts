import { Quill }     from "react-quill";
import QuillCursors   from "quill-cursors";
import hljs           from "highlight.js/lib/common";

Quill.register("modules/cursors", QuillCursors);

export const quillModules = {
  cursors: true,
  toolbar: false,
  syntax : {
    highlight: (text: string) => hljs.highlightAuto(text).value,
  },
};
