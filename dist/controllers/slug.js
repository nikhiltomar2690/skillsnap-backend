import { getFullUserBySlug } from "../queries/userQueries.js";
export const getUserProfileBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const user = await getFullUserBySlug(slug);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        console.error("Error fetching user by slug:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
