import React, { useState } from 'react';
import { Card, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useSnackbar } from 'notistack';

const useLoginStyles = makeStyles({
	container: {
		backgroundSize: 'cover',
		height: '100%',
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	cardContainer: {
		marginTop: '200px',
		width: '550px',
	},
	cardContent: {
		width: '80%',
		margin: '40px auto',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	loginForm: {
		width: '100%',
		maxWidth: '350px',
		display: 'flex',
		flexDirection: 'column',
	},
	formInput: {
		marginTop: '10px',
	},
	button: {
		marginTop: '10px',
	},
	appTitle: {
		fontWeight: 200,
		fontSize: 24,
		textAlign: 'center',
	},
	notice: {
		textAlign: 'center',
		marginBottom: '15px',
	},
});

export const Login = () => {
	const classes = useLoginStyles();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const handleSubmit = React.useCallback(async(e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await authApi.login(email, password);
			history.push('/vehicle-types');
			enqueueSnackbar('Successful login.', { variant: 'success' });
		} catch (error) {
			enqueueSnackbar('Invalid username/password. Try digi/hey.', { variant: 'error' });
		}
	}, [history, email, password]);

	return (
		<div className={classes.container}>
			<Card elevation={3} className={classes.cardContainer} >
				<div className={classes.cardContent}>
					<div>Digihey Interview</div>
					<form className={classes.loginForm}
						onSubmit={handleSubmit}
					>
						<TextField
							className={classes.formInput}
							variant='outlined'
							size='small'
							label='Username'
							onChange={e => setEmail(e.target.value)}
						/>
						<TextField
							className={classes.formInput}
							variant='outlined'
							size='small'
							margin='normal'
							label='Pasword'
							type='password'
							onChange={e => setPassword(e.target.value)}
						/>
						<Button type='submit' variant='contained' color='primary' size='medium'
							className={classes.button}>
							Login
						</Button>
					</form>
				</div>
			</Card>
		</div>
	);
};
