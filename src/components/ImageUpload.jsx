// src/components/ImageUpload.jsx
import { useRef, useState } from "react";
import Button from "./Button";
import "./ImageUpload.css";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error("Image upload failed. Please try again.");
  }

  const data = await response.json();
  return data.secure_url;
}

export default function ImageUpload({ onUploaded, existingUrl, label = "Photo" }) {
  const [preview, setPreview] = useState(existingUrl || null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const url = await uploadToCloudinary(file);
      onUploaded(url);
    } catch (err) {
      setError(err.message);
      setPreview(existingUrl || null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="image-upload">
      <label className="image-upload__label">{label}</label>

      {preview && (
        <img src={preview} alt="Preview" className="image-upload__preview" />
      )}

      <div className="image-upload__control">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="image-upload__input"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          Upload photo
        </Button>
        {fileName && (
          <span className="image-upload__filename">{uploading ? "Uploading..." : fileName}</span>
        )}
      </div>

      {error && <p className="image-upload__error">{error}</p>}
    </div>
  );
}