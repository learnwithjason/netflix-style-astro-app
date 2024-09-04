import { v2 as cloudinary, type TransformationOptions } from 'cloudinary';

cloudinary.config({
	cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
});

export function createImageUrl(
	public_id: string,
	transformations: TransformationOptions = {},
) {
	const base_transformation: TransformationOptions = {
		quality: 'auto',
		format: 'auto',
	};

	const url = cloudinary.url(public_id, {
		transformation: [base_transformation, transformations],
	});

	return url;
}

export function getYouTubeThumbnail(youtube_id: string) {
	return cloudinary.url(youtube_id, { type: 'youtube' });
}

function cleanText(text: string) {
	return encodeURIComponent(text).replace(/%(23|2C|2F|3F|5C)/g, '%25$1');
}

export function generateEpisodePoster() {
	const url = cloudinary.url('lwj/episode-video-2023-v3-solo', {
		transformation: [
			{
				quality: 'auto',
				format: 'auto',
			},
			{
				width: 1920,
				aspect_ratio: '16:9',
				crop: 'fill',
			},
			{
				overlay: {
					font_family: 'jwf-bold%2Eotf',
					font_size: 80,
					line_spacing: 0,
					text: 'This is a test title',
				},
				crop: 'fit',
				color: 'white',
				width: 800,
			},
			{ flags: 'layer_apply', gravity: 'north_west', x: 1035, y: 475 },
		],
	});

	return url;
}
