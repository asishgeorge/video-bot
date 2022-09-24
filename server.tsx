import {bundle} from '@remotion/bundler';
import {
	getCompositions,
	renderMedia,
	RenderMediaOnProgress,
} from '@remotion/renderer';
import express from 'express';
import path from 'path';

const app = express();
const port = 8000;

app.get('/', async (req, res) => {
	try {
		let a = await start();
		console.log('a', a);
		res.send('done');
	} catch (error) {
		console.log('err', error);
		res.send(error);
	}
});

app.listen(port);

console.log(
	[
		`The server has started on http://localhost:${port}!`,
		'You can render a video by passing props as URL parameters.',
		'',
		'If you are running Hello World, try this:',
		'',
		`http://localhost:${port}?titleText=Hello,+World!&titleColor=red`,
		'',
	].join('\n')
);

const start = async () => {
	// The composition you want to render
	const compositionId = 'RedditTitleComp';

	// You only have to do this once, you can reuse the bundle.
	const entry = './src/index';
	console.log('Creating a Webpack bundle of the video');
	const bundleLocation = await bundle(path.resolve(entry), () => undefined, {
		// If you have a Webpack override, make sure to add it here
		webpackOverride: (config) => config,
	});

	// Parametrize the video by passing arbitrary props to your component.
	const inputProps = {
		foo: 'bar',
	};

	// Extract all the compositions you have defined in your project
	// from the webpack bundle.
	const comps = await getCompositions(bundleLocation, {
		// You can pass custom input props that you can retrieve using getInputProps()
		// in the composition list. Use this if you want to dynamically set the duration or
		// dimensions of the video.
		inputProps,
	});

	// Select the composition you want to render.
	const composition = comps.find((c) => c.id === compositionId);

	// Ensure the composition exists
	if (!composition) {
		throw new Error(`No composition with the ID ${compositionId} found.
  Review "${entry}" for the correct ID.`);
	}

	const outputLocation = path.resolve('./out', `${compositionId}.mp4`);
	console.log('Attempting to render:', outputLocation);
	await renderMedia({
		composition,
		serveUrl: bundleLocation,
		codec: 'h264',
		outputLocation,
		inputProps,
		onStart: (e) => {
			console.log('started', e);
		},
		onProgress,
	});
	console.log('Render done!');
};


const onProgress: RenderMediaOnProgress = ({
	renderedFrames,
	encodedFrames,
	encodedDoneIn,
	renderedDoneIn,
	stitchStage,
}) => {
	if (stitchStage === 'encoding') {
		// First pass, parallel rendering of frames and encoding into video
		console.log('Encoding...');
	} else if (stitchStage === 'muxing') {
		// Second pass, adding audio to the video
		console.log('Muxing audio...');
	}
	// Amount of frames rendered into images
	console.log(`${renderedFrames} rendered`);
	// Amount of frame encoded into a video
	console.log(`${encodedFrames} encoded`);
	// Time to create images of all frames
	if (renderedDoneIn !== null) {
		console.log(`Rendered in ${renderedDoneIn}ms`);
	}
	// Time to encode video from images
	if (encodedDoneIn !== null) {
		console.log(`Encoded in ${encodedDoneIn}ms`);
	}
};
