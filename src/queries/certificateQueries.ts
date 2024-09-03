// certificateService.ts
import { Certificate } from "../models/certificate.js";
import { User } from "../models/user.js";

// Function to create a new certificate
export async function createNewCertificate(
  userId: string,
  certificateData: any
) {
  const newCertificate = new Certificate({
    userId,
    ...certificateData,
  });

  return await newCertificate.save();
}

// Function to update user with new certificate reference
export async function updateUserWithCertificate(
  userId: string,
  certificateId: string
) {
  return await User.findByIdAndUpdate(
    userId,
    { $push: { certificates: certificateId } },
    { new: true }
  );
}

// Function to delete a certificate by ID
export async function deleteCertificateById(certificateId: string) {
  return await Certificate.findByIdAndDelete(certificateId);
}

// Function to remove certificate reference from user
export async function removeCertificateFromUser(
  userId: string,
  certificateId: string
) {
  return await User.findByIdAndUpdate(
    userId,
    { $pull: { certificates: certificateId } },
    { new: true }
  );
}

// Function to get a certificate by ID
export async function getCertificateById(certificateId: string) {
  return await Certificate.findById(certificateId).populate(
    "userId",
    "name email"
  );
}
