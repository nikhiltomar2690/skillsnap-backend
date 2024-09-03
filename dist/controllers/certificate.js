import { createNewCertificate, updateUserWithCertificate, deleteCertificateById, removeCertificateFromUser, getCertificateById, } from "../queries/certificateQueries.js";
// Create Certificate
export const createCertificate = async (req, res) => {
    const { userId, certificateName, link, startDate, endDate, isLifetime, description, } = req.body;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "userId is required.",
        });
    }
    if (!certificateName) {
        return res.status(400).json({
            success: false,
            message: "certificateName is required.",
        });
    }
    try {
        const newCertificate = await createNewCertificate(userId, {
            certificateName,
            link,
            startDate,
            endDate,
            isLifetime,
            description,
        });
        // Update the User document to include the new certificate
        await updateUserWithCertificate(userId, newCertificate._id.toString());
        return res.status(201).json({
            success: true,
            message: "Certificate created successfully",
            data: newCertificate,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Delete Certificate
export const deleteCertificate = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Certificate ID is required.",
        });
    }
    try {
        const deletedCertificate = await deleteCertificateById(id);
        if (!deletedCertificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found",
            });
        }
        // Remove the reference to the deleted certificate from the User document
        removeCertificateFromUser(deletedCertificate.userId.toString(), id);
        return res.status(200).json({
            success: true,
            message: "Certificate deleted successfully",
            data: deletedCertificate,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get Certificate by ID
export const getCertificate = async (req, res) => {
    const { id } = req.params;
    try {
        const certificate = await getCertificateById(id);
        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: certificate,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
