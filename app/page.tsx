"use client";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import {
  LCSaveType,
  SaveFileEditor,
  Vector3,
} from "../components/save-file-editor";

function checkIfAnyPosExactlyEqual(shipGrabbableItemPos: {
  value: Vector3[];
}): boolean {
  const positions = shipGrabbableItemPos.value;

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      if (
        positions[i].x === positions[j].x &&
        positions[i].y === positions[j].y &&
        positions[i].z === positions[j].z
      ) {
        return true; // Found two positions that are exactly equal
      }
    }
  }

  return false; // No two positions are exactly equal
}

export default function Home() {
  const [file, setFile] = useState<File>();
  const [saveName, setSaveName] = useState("");
  const [save, setSave] = useState<LCSaveType>();
  const [originalSave, setOriginalSave] = useState<LCSaveType>();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
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
      alert(res.error || res);
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
    }
    console.log(res);
  };

  const handleFileInputClick = (event: any) => {
    hiddenFileInput.current?.click();
  };

  return (
    <main className={styles.main}>
      <div
        className={`card w-full ${
          !save ? "lg:w-5/12" : "lg:w-full"
        } md:w-full rounded-lg px-20 py-10 shadow-lg`}
      >
        {save && (
          <h1 className="font-bold text-2xl mb-2">
            Lethal Company Save Editor
          </h1>
        )}
        {!save && (
          <div>
            <div
              className="w-full cursor-pointer hover:text-[#848484] h-24 flex justify-center border-dashed border-2 border-[#848484] items-center text-center"
              onClick={handleFileInputClick}
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
        {save && <SaveFileEditor save={save} setSave={setSave} />}
        <div className="mt-8 text-center">
          <p className="mb-1 text-sm">
            Game Version: {save?.FileGameVers.value}
          </p>
          {originalSave && (
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
