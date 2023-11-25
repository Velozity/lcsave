"use client";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import { LCSaveType, SaveFileEditor } from "../components/save-file-editor";

export default function Home() {
  const [file, setFile] = useState<File>();
  const [saveName, setSaveName] = useState("");
  const [save, setSave] = useState<LCSaveType>();
  const [originalSave, setOriginalSave] = useState<LCSaveType>();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragOver(false);
  };
  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFile(file);
    }
  };
  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

  const handleUpload = async () => {
    if (!file) return;

    const data = new FormData();
    data.set("file", file);

    const res = await fetch("/api/decrypt", { method: "POST", body: data })
      .then((r) => r.json())
      .catch((e) => e);

    if (res && res.success) {
      setSave(JSON.parse(res.decrypted));
      setOriginalSave(JSON.parse(res.decrypted));
      setSaveName(file.name);
    } else {
      alert(
        res.error ||
          "Something went wrong, make sure you are uploading a valid save file."
      );
    }
  };

  function downloadBufferAsFile(
    buffer: any,
    filename: any,
    contentType = "application/octet-stream"
  ) {
    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: contentType });

    // Create a link element
    const link = document.createElement("a");

    // Set the download attribute with the filename
    link.download = filename;

    // Create a temporary URL for the Blob
    link.href = window.URL.createObjectURL(blob);

    // Append the link to the body
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up by removing the link and revoking the URL
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    }, 100);
  }

  const handleEncrypt = async () => {
    if (!save) return;

    // checks
    const data = new FormData();
    data.set("save", JSON.stringify(save));

    const res = await fetch("/api/encrypt", {
      method: "POST",
      body: data,
    })
      .then((r) => r.json())
      .catch((e) => e);

    if (res && res.success) {
      downloadBufferAsFile(Buffer.from(res.encrypted), saveName);
    } else {
      alert(
        res.error ||
          "An unexpected error occurred. Please double check your settings."
      );
    }
  };

  const handleFileInputClick = (event: any) => {
    hiddenFileInput.current?.click();
  };

  return (
    <main className={styles.main}>
      {save && (
        <div
          className="absolute top-[40px] right-[35px] cursor-pointer hover:text-[grey]"
          onClick={() => {
            setSave(undefined);
            setOriginalSave(undefined);
            setFile(undefined);
            setSaveName("");
          }}
        >
          x
        </div>
      )}
      <div
        className={`card w-full ${
          !save ? "lg:w-5/12" : "lg:w-full"
        } md:w-full rounded-lg px-20 py-10 shadow-lg`}
      >
        {save ? (
          <h1 className="font-bold text-2xl mb-2">
            Lethal Company Save Editor
          </h1>
        ) : (
          <h1 className="font-bold text-2xl mb-4 text-center">
            Lethal Company Save Editor
          </h1>
        )}
        {!save && (
          <div>
            <div
              className={`w-full cursor-pointer h-24 flex justify-center border-dashed border-2 border-[#848484] px-6 hover:border-[#848484] items-center text-center ${
                dragOver ? "border-[#848484]" : "border-[#ccc]"
              }`}
              onClick={handleFileInputClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              Drop or Upload LC Save File
            </div>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              ref={hiddenFileInput}
              style={{ display: "none" }}
              hidden
            />
          </div>
        )}
        {!save && (
          <p className="mb-1 text-sm text-center mt-4 text-[#B5B5B5]">
            You can find your save files in:
            <br />
            <span className="italic">
              %AppData%/LocalLow/ZeekerssRBLX/Lethal Company/LCSaveFile1
            </span>
          </p>
        )}
        {save && <SaveFileEditor save={save} setSave={setSave} />}
        <div className="mt-4 text-center">
          {save && (
            <p className="mb-1 text-sm">
              File: {file?.name}
              <br />
              Game Version: {save?.FileGameVers.value}
            </p>
          )}
          {originalSave && save && (
            <button
              className="px-4 py-2 bg-[#fff] text-black mr-4 hover:bg-[grey] hover:text-white"
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to reset this save back to its original state?"
                  )
                ) {
                  setSave(originalSave);
                }
              }}
            >
              Revert All Changes
            </button>
          )}
          {save && (
            <button
              onClick={() => {
                handleEncrypt();
              }}
              className="px-4 py-2 bg-[#fff] text-black hover:bg-[grey] hover:text-white"
            >
              Save & Download
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
