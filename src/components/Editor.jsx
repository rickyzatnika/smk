import QuillEditor from "react-quill"
import "react-quill/dist/quill.snow.css";

const MyEditor = ({ value, onChange }) => (
  <QuillEditor
    value={value}
    onChange={onChange}
    theme="snow"
    formats={MyEditor.formats}
    className="w-full custom-quill text-sm bg-gray-50 dark:bg-slate-800 border-none outline-none dark:text-gray-200 h-full "
  />
);



MyEditor.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];

export default MyEditor;



