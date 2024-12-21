import axios from "axios";

export const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your-upload-preset"); // From Cloudinary settings

    try {
        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/your-cloud-name/image/upload",
            formData
        );
        console.log("Uploaded file URL:", response.data.secure_url);
        return response.data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw error; // Rethrow the error for handling in calling code
    }
};
