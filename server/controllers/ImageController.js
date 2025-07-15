import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import userModel from '../models/userModel.js';

const removeBgImage = async (req, res) => {
    try {
        const { clerkId } = req.user;  // 🔁 you can rename this to userId if you're done with Clerk
        const user = await userModel.findOne({ clerkId });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.creditBalance === 0) {
            return res.json({ success: false, message: "No credit balance", creditBalance: 0 });
        }

        const imagePath = req.file.path;
        const imageFile = fs.createReadStream(imagePath);

        const formData = new FormData();
        formData.append('image_file', imageFile);

        const { data } = await axios.post('https://clipdrop-api.co/remove-background/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
                ...formData.getHeaders()
            },
            responseType: "arraybuffer"
        });

        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:${req.file.mimetype};base64,${base64Image}`;

        const updatedCredits = user.creditBalance - 1;
        await userModel.findByIdAndUpdate(user._id, { creditBalance: updatedCredits });

        res.json({ success: true, resultImage, creditBalance: updatedCredits, message: "Background removed" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export { removeBgImage };
