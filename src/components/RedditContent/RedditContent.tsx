import {AbsoluteFill} from 'remotion';
export const RedditContent: React.FC<{
	title: string;
}> = ({title}) => {
	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: 40,
			}}
		>
			<div
				style={{
					backgroundColor: 'white',

					margin: '0 auto',
					borderRadius: 50,
					padding: 40,
					boxShadow: '10px 10px #F4AAB9',
				}}
			>
				<p
					style={{
						textAlign: 'center',
						fontSize: 35,
						color: 'black',
					}}
				>
					{title}
				</p>
			</div>
		</AbsoluteFill>
	);
};
