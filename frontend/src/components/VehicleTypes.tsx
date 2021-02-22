import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, TextField, Tooltip } from '@material-ui/core';
import { Add, Delete, PowerSettingsNew } from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Table, { Column, FetchPageAsPromise } from 'src/components/Table';
import { authApi } from 'src/api/auth';
import { VehicleType, vehicleTypeApi, VehicleTypeCreate } from 'src/api/vehicle-types';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles({
	queryInput: {
		margin: '10px 0 10px 10px',
		width: '300px',
	},
	top: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

export const VehicleTypes = () => {
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	if (!authApi.isLoggedIn()) {
		history.push('/login');
		return <></>;
	}

	const classes = useStyles();
	const [query, setQuery] = React.useState('');

	const getPage: FetchPageAsPromise<any> = React.useCallback(({ page, size }) => vehicleTypeApi.searchPage(query, page, size), [query]);

	const [dialogOpen, setDialogOpen] = React.useState(false);
	const handleDialogClose = React.useCallback(() => {
		setVehicleTypeCreateForm({ make: '', model: '', year: 0 });
		setDialogOpen(false);
	}, []);
	const [vehicleTypeCreateForm, setVehicleTypeCreateForm] = React.useState<VehicleTypeCreate>({ make: '', model: '', year: 0 });

	return <div>
		<div style={{
			display: 'flex',
			justifyContent: 'space-between',
		}}>
			<TextField className={classes.queryInput} variant='outlined' size='small' label="Search vehicle types..." value={query} onChange={e => setQuery(e.target.value)} />
			<div style={{ height: '100%' }}>
				<Tooltip title='Add Vehicle Type'>
					<IconButton onClick={_ => setDialogOpen(true)}>
						<Add fontSize='small' />
					</IconButton>
				</Tooltip>
			</div>
			<div>
				<Tooltip title='Logout'>
					<IconButton onClick={_ => {
						authApi.logout();
						history.push('/login');
					}}>
						<PowerSettingsNew fontSize='small' />
					</IconButton>
				</Tooltip>
			</div>
		</div>
		<Table fetchTablePageFn={getPage} options={{ title: 'Vehicle Types', defaultPageSize: 10, pageSizeOptions: [5, 10, 15] }} >
			<Column field='make' label='Make' sortBy={false} />
			<Column field='model' label='Model' sortBy={false} />
			<Column field='year' label='Year' sortBy={false} />
			<Column width={'5%'}>
				{(row: VehicleType, _isRowSelected, _toggleRowSelection, refreshPage) => {
					return (
						<div style={{
							display: 'flex',
							justifyContent: 'flex-end',
						}}>
							<Tooltip title='Delete'>
								<IconButton onClick={async _ => {
									try {
										await vehicleTypeApi.delete(row.id);
										enqueueSnackbar(`Successfully deleted (${row.make}, ${row.model}, ${row.year}).`, { variant: 'success' });
										refreshPage();
									} catch (error) {
										enqueueSnackbar(`Failed to delete (${row.make}, ${row.model}, ${row.year}).`, { variant: 'error' });
									}
								}}>
									<Delete fontSize='small' />
								</IconButton>
							</Tooltip>
						</div>
					);
				}}
			</Column>
		</Table>

		<Dialog open={dialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
			<DialogTitle id="form-dialog-title">Create Vehicle Type</DialogTitle>
			<DialogContent>
				<TextField
					value={vehicleTypeCreateForm.make}
					onChange={e => setVehicleTypeCreateForm({ ...vehicleTypeCreateForm, make: e.target.value })}
					autoFocus
					variant='outlined'
					margin="dense"
					label="Make"
					fullWidth
				/>
				<TextField
					value={vehicleTypeCreateForm.model}
					onChange={e => setVehicleTypeCreateForm({ ...vehicleTypeCreateForm, model: e.target.value })}
					autoFocus
					variant='outlined'
					margin="dense"
					label="Model"
					fullWidth
				/>
				<TextField
					value={vehicleTypeCreateForm.year}
					onChange={e => setVehicleTypeCreateForm({ ...vehicleTypeCreateForm, year: Number(e.target.value) })}
					autoFocus
					variant='outlined'
					margin="dense"
					label="Year"
					type='number'
					fullWidth
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleDialogClose} color="primary">
            Cancel
				</Button>
				<Button onClick={async() => {
					try {
						await vehicleTypeApi.create(vehicleTypeCreateForm);
						enqueueSnackbar(`Successfully created (${vehicleTypeCreateForm.make}, ${vehicleTypeCreateForm.model}, ${vehicleTypeCreateForm.year}).`, { variant: 'success' });
					} catch (error) {
						enqueueSnackbar(`Failed to create (${vehicleTypeCreateForm.make}, ${vehicleTypeCreateForm.model}, ${vehicleTypeCreateForm.year}).`, { variant: 'error' });
					}
					handleDialogClose();
				}} color="primary">
            Create
				</Button>
			</DialogActions>
		</Dialog>
	</div>;
};
