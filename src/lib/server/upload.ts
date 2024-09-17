import * as cloudinary from 'cloudinary';

// Custom error class
export class UploadError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'UploadError';
	}
}

const generateUniqueFileName = (originalFileName: string) => {
	return `${new Date().getTime()}`;
};

export const uploadMedia = async (file: File): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		try {
			const fileName = generateUniqueFileName(file.name);
			// Check if file is an image or video
			const isImage = file.type.split('/')[0] === 'image';
			const isVideo = file.type.split('/')[0] === 'video';

			if (!isImage && !isVideo) {
				throw new UploadError('File must be an image or video');
			}

			const buffer = await file.arrayBuffer();

			// Upload to cloudinary
			const result = await cloudinary.v2.uploader.upload_stream(
				{
					resource_type: isImage ? 'image' : 'video',
					public_id: fileName,
					overwrite: true,
					transformation: [
						{
							quality: 'auto',
							format: 'auto',
							fetch_format: 'auto'
						}
					]
				},
				(error, result) => {
					if (error) {
						reject(new UploadError(error.message || 'An error occurred while uploading media'));
					}
					if (result) {
						const url = result.url;
						resolve(url);
					}
				}
			);

			await result.end(Buffer.from(buffer));
		} catch (error: any) {
			console.log(error);
			reject(new UploadError(error.message || 'An error occurred while uploading media'));
		}
	});
};
