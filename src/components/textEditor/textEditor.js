import React from "react";

import dynamic from "next/dynamic";
const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
});
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ value, onChange, placeholder = "" }) => {
    const modules = {
        toolbar: [
            [{ font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            [{ align: [] }],
            ["blockquote", "code-block"],
            [{ color: [] }, { background: [] }],
            ["link", "image", "video"],
            ["clean"],
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        },
    };
    const formats = [
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "indent",
        "align",
        "blockquote",
        "code-block",
        "color",
        "background",
        "link",
        "image",
        "video",
    ];

    return (
        <QuillNoSSRWrapper
            theme="snow"
            modules={modules}
            value={value}
            formats={formats}
            onChange={onChange}
            placeholder={placeholder}
        ></QuillNoSSRWrapper>
    );
};

export default TextEditor;
