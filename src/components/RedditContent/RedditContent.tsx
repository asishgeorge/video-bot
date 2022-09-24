import {AbsoluteFill} from 'remotion';
import './content.css';

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
				background: 'linear-gradient(0deg, rgba(217, 175, 217, 1) 0%, rgba(151, 217, 225, 1) 100%)',
			}}
		>
			<div
				style={{
					background: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
					margin: '0 auto',
					borderRadius: 50,
					padding: 40,
					// boxShadow: '10px 10px #F4AAB9',
				}}
			>
				<p
					style={{
						textAlign: 'center',
						fontSize: 35,
						color: 'white',
						fontFamily: 'Poppins',
					}}
				>
					{title}
				</p>
			</div>
		</AbsoluteFill>
	);
};
