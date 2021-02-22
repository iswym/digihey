import React from 'react';
import { VehicleTypes } from 'src/components/VehicleTypes';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Login } from './components/Login';
import { SnackbarProvider } from 'notistack';
import { authApi } from './api/auth';

const App = () => {
	return <>
		<SnackbarProvider anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'right',
		}}>
			<Router>
				<Switch>
					<Route path='/login'>
						<Login />
					</Route>
					<Route path='/vehicle-types'>
						<VehicleTypes />
					</Route>
					<Route path='/'>
						{authApi.isLoggedIn() ? <Redirect to="/vehicle-types" /> : <Redirect to="/login" />}
					</Route>
				</Switch>
			</Router>
		</SnackbarProvider>
	</>;
};

export default App;
