import * as XLSX from "xlsx";

const FileUpload = ({ setItems, dark }) => {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      setItems(json);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className={`card p-4 mb-4 ${dark ? "bg-secondary text-light" : ""}`}>
      <h5>📂 Upload Excel File</h5>
      <input type="file" className="form-control" onChange={handleFile} />
    </div>
  );
};

export default FileUpload;