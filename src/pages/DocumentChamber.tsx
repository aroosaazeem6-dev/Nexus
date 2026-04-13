import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function DocumentChamber() {
    const [file, setFile] = useState<any>(null);
    const [status, setStatus] = useState<"Draft" | "In Review" | "Signed">("Draft");

    const sigRef = useRef<any>(null);
    const fileInputRef = useRef<any>(null); // ✅ for resetting input

    // Upload file
    const handleUpload = (e: any) => {
        const uploaded = e.target.files[0];
        if (uploaded) {
            setFile(URL.createObjectURL(uploaded));
            setStatus("Draft");
        }
    };

    // Remove file (FULL RESET)
    const removeFile = () => {
        setFile(null);
        setStatus("Draft");

        if (sigRef.current) {
            sigRef.current.clear();
        }

        // ✅ reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Send to review
    const sendToReview = () => {
        setStatus("In Review");
    };

    // Sign document
    const signDocument = () => {
        if (!sigRef.current.isEmpty()) {
            setStatus("Signed");
            alert("Document Signed Successfully!");
        } else {
            alert("Please provide signature first");
        }
    };

    // Clear signature
    const clearSignature = () => {
        sigRef.current.clear();
    };

    // Status styles
    const getStatusStyle = () => {
        switch (status) {
            case "Draft":
                return "bg-yellow-100 text-yellow-700";
            case "In Review":
                return "bg-blue-100 text-blue-700";
            case "Signed":
                return "bg-green-100 text-green-700";
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">📄 Document Chamber</h2>

            {/* Upload */}
            <div className="mb-4">
                <input
                    type="file"
                    ref={fileInputRef} // ✅ attach ref
                    onChange={handleUpload}
                    className="border p-2 rounded"
                />
            </div>

            {/* Status */}
            <div className="mb-4">
                <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusStyle()}`}>
                    Status: {status}
                </span>
            </div>

            {/* File Preview + Remove */}
            {file && (
                <div className="mb-6">

                    {/* Remove Button */}
                    <div className="flex justify-end mb-2">
                        <button
                            onClick={removeFile}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                        >
                            Remove File
                        </button>
                    </div>

                    {/* Preview */}
                    <div className="border rounded-lg overflow-hidden">
                        <iframe
                            src={file}
                            title="Document Preview"
                            className="w-full h-80"
                        />
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="mb-6 flex gap-3">

                {/* Draft → Review */}
                {status === "Draft" && file && (
                    <button
                        onClick={sendToReview}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Send for Review
                    </button>
                )}

                {/* Back to Draft */}
                {status === "In Review" && (
                    <button
                        onClick={() => setStatus("Draft")}
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                        Back to Draft
                    </button>
                )}
            </div>

            {/* Signature Section */}
            {status === "In Review" && (
                <div className="border p-4 rounded-lg bg-white shadow">
                    <h3 className="font-semibold mb-2">E-Signature</h3>

                    <SignatureCanvas
                        ref={sigRef}
                        canvasProps={{
                            width: 400,
                            height: 150,
                            className: "border rounded",
                        }}
                    />

                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={clearSignature}
                            className="px-3 py-1 bg-gray-500 text-white rounded"
                        >
                            Clear
                        </button>

                        <button
                            onClick={signDocument}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Sign Document
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}