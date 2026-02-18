import "./FileInput.css";
import { ChangeEvent } from "react";

function FileInput({
  onChange: onChange,
}: {
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <>
      <input type="file" id="file-upload" onChange={onChange} accept=".csv" className="file-input" />
      <label htmlFor="file-upload" className="file-upload-button">
        Upload CSV
      </label>
    </>
  );
}

export default FileInput;
