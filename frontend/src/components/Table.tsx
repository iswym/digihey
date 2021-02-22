import React from 'react';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { Refresh, Delete, Add } from '@material-ui/icons';
import { TableRow as MuiTableRow, Table as MuiTable, TableHead, LinearProgress, TableSortLabel, Toolbar, Typography, Paper, IconButton, Tooltip, TableCell, TablePagination, TableContainer, TableBody, Checkbox } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { isValid } from 'date-fns';

interface ToolbarLabels {
	create?: string;
	delete?: string;
	refresh?: string;
}

interface TableHeaderProps<T> {
	columns: ColumnProps<T>[];
	sortOptions?: TableSortOptions;
	onSortChange: (sortBy: string) => void;
	pageLoading: boolean;
}


interface TableOptions {
	title?: string;
	defaultPageSize?: number;
	pageSizeOptions?: number[];
	rowSelectionProperty?: string;
	translate?: (key: string) => string;
}

export interface PagingOptions {
	page: number;
	size: number;
}

export type TableSortOptions = {
	sortBy: string;
	sortDir: SortDirection;
}

export interface TablePage<T> {
	data: TableRow<T>[];
	total: number;
}

export const tablePage = <T,>(data: T[], total: number): TablePage<T> => ({ data, total });

enum SortDirection {
	ASC = 'ASC',
	DESC = 'DESC'
}

export interface SortOptions {
	[key: string]: SortDirection;
}

// either fetchTablePageFn returns Promise or it takes in 3rd argument with which it sets state
export type FetchPageAsPromise<T> = (pagingOptions: PagingOptions, sortOptions?: TableSortOptions) => Promise<TablePage<T>>;

/**
 * Each time callback is called we set table page. Returning function can be used to cancel callback invokes.
 */
export type TablePageStream<T> = (callback: (data: TableRow<T>[], total: number) => void) => () => void;

export type FetchPageAsStream<T> = (pagingOptions: PagingOptions, sortOptions?: TableSortOptions) => TablePageStream<T>;

interface TableProps<T> {
	fetchTablePageFn?: FetchPageAsPromise<T> | FetchPageAsStream<T>;
	children: TableChild<T> | TableChild<T>[];
	options?: TableOptions;
	toolbarActions?: JSX.Element;
	labels?: ToolbarLabels;
	className?: string;
}

export interface ColumnProps<T> {
	width?: string | number;
	align?: 'left' | 'right';
	label?: string;
	field?: string;
	async?: boolean;
	sortBy?: string | false;
	children?: (
		row: T,
		isRowSelected: boolean,
		toggleRowSelection: (rowSelectionProperty: any, selected?: boolean) => void,
		refreshPage: () => void
	) => JSX.Element;
}

type ColumnChild<T> = React.ReactElement<ColumnProps<T>>;
type ComponentYieldingColumnChild<T> = React.ReactElement<any, (props: any) => React.ReactElement<ColumnProps<T>>>

type TableChild<T> = ColumnChild<T> | ComponentYieldingColumnChild<T>;

const TableHeader = <T,>(props: TableHeaderProps<T>) => {
	return (
		<TableHead>
			<MuiTableRow>
				{props.columns?.map((col, idx) => {
					const colSortBy = col.sortBy === false ? undefined : (col.sortBy || col.field || undefined);
					const sortDirection = props.sortOptions && props.sortOptions.sortBy === colSortBy ? (
						props.sortOptions.sortDir === SortDirection.ASC ? 'asc' : 'desc'
					) : undefined;
					return (
						<TableCell
							style={{ border: 'none', width: col.width }}
							key={`${col.field}-${idx}`}
							align={col.align}
						>
							{colSortBy ? (
								<TableSortLabel
									active={!!sortDirection}
									direction={sortDirection}
									onClick={_ => colSortBy && props.onSortChange(colSortBy)}
								>
									{col.label}
								</TableSortLabel>
							) : col.label}
						</TableCell>
					);
				})}
			</MuiTableRow>
			<MuiTableRow>
				<TableCell style={{ padding: 0 }} colSpan={props.columns.length}>
					{props.pageLoading ? <LinearProgress style={{ width: '100%', position: 'relative' }} /> : <div style={{ width: '100%', position: 'relative', height: '4px' }} />}
				</TableCell>
			</MuiTableRow>
		</TableHead>
	);
};

export interface TableToolbarActionsProps {
	selectedRows?: Set<any>;
	deselectRows?: () => void;
	refresh?: () => any;
	create?: () => any;
	deleteSelected?: (selectedRows: Set<any>, deselectRows: () => void, refresh: () => void) => any;
	labels?: ToolbarLabels;
}

export const TableToolbarActions = (props: TableToolbarActionsProps) => {
	const { selectedRows, deselectRows, refresh, create, deleteSelected } = props;
	if (!selectedRows || !deselectRows || !refresh) return null;
	return <>
		{
			!!deleteSelected && !!selectedRows.size &&
			<Tooltip title={props.labels?.delete || 'Delete selected'}>
				<IconButton
					aria-label='delete'
					onClick={() => deleteSelected(selectedRows, deselectRows, refresh)}>
					<Delete />
				</IconButton>
			</Tooltip>
		}
		{
			create &&
			<Tooltip title={props.labels?.create || 'Create'}>
				<IconButton aria-label='create' onClick={() => create()}>
					<Add />
				</IconButton>
			</Tooltip>
		}
		<Tooltip title={props.labels?.refresh || 'Refresh'}>
			<IconButton aria-label='refresh' onClick={refresh}>
				<Refresh />
			</IconButton>
		</Tooltip>
	</>;
};

const useStyles = makeStyles((_theme) => ({
	root: {
		width: '100%',
	},
	paper: {
		width: '100%',
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1,
	},
	muiTableRow: {
		backgroundColor: 'yellow',
	},
}));

const PageLoadingProgress = ({ numColumns, numRows }: { numColumns: number; numRows: number }) => (<>
	{
		Array.from(Array(numRows).keys()).map((_, rowIdx) => (
			<MuiTableRow key={rowIdx}>
				{
					Array.from(Array(numColumns).keys()).map((_, colIdx) => (
						<TableCell key={colIdx} style={{}}>
							<Skeleton />
						</TableCell>
					))
				}
			</MuiTableRow>
		))
	}
</>);

// TODO: do we really need generic type on table row??
type TableRow<T> = T;

interface TableRowsProps<T> {
	columns: ColumnProps<T>[];
	rows: TableRow<T>[];
	onRowClick: (row: TableRow<T>) => void;
	toggleRowSelection: (rowSelectionProperty: any, selected?: boolean) => void;
	isRowSelected: (row: TableRow<T>) => boolean;
	refreshPage: () => void;
}

const TableRows = <T,>(props: TableRowsProps<T>) => {
	return <>
		{props.rows.map(
			(row, rowIdx) => (
				<MuiTableRow
					hover
					onClick={_ => props.onRowClick(row)}
					// role='checkbox'
					// aria-checked={isItemSelected}
					tabIndex={-1}
					key={`row-${rowIdx}`}
					selected={props.isRowSelected(row)}
				>
					{props.columns.map(
						(col, colIdx) => {
							let cellContent;
							if (col.children) {
								cellContent = col.children(row, props.isRowSelected(row), props.toggleRowSelection, props.refreshPage);
							} else if (row[col.field as keyof T] === undefined && col.async) {
								cellContent = <Skeleton />;
							} else {
								cellContent = row[col.field as keyof T];
							}

							return (
								<TableCell key={colIdx} component='th' id={col.label} scope='row' align={col.align} style={{ width: col.width }}>
									{cellContent}
								</TableCell>
							);
						},
					)}
				</MuiTableRow>
			),
		)}
	</>;
};

const Table = <T,>(props: TableProps<T>) => {
	const classes = useStyles();

	// columns
	// child is either <Column /> which props we need
	// OR React component which when rendered produces <Column /> with props we need
	const columnDefs = React.useMemo(
		() => {
			const children = Array.isArray(props.children) ? props.children : [props.children];
			// TODO: can we improve typing so it's without casts
			return children
				.filter(child => child)
				.map(child => {
					if (typeof child.type !== 'function') throw new Error('<Table /> child must be either <Column /> or React component that returns <Column />');
					if (child.type === TestColumn.type) return (child as ColumnChild<T>).props;

					const yieldedChild = (child as ComponentYieldingColumnChild<T>).type(child.props);
					if (typeof yieldedChild.type !== 'function') throw new Error('Table child must be either <Column /> or React component that returns <Column />');
					if (yieldedChild.type === TestColumn.type) return yieldedChild.props;

					throw new Error('Table child must be either <Column /> or React component that returns <Column />');
				});
		},
		[props.children],
	);

	// sorting
	const [tableSortOptions, setTableSortOptions] = React.useState<TableSortOptions | undefined>();
	const updateSort = React.useCallback((sortBy: string) => {
		const getNextSortDir = (sortDir?: SortDirection) => {
			if (sortDir === SortDirection.ASC) return SortDirection.DESC;
			if (sortDir === SortDirection.DESC) return SortDirection.ASC;
			return SortDirection.ASC;
		};

		setTableSortOptions(prev => ({
			sortBy,
			sortDir: getNextSortDir(prev?.sortDir),
		}));
	}, []);

	// selection
	const rowSelectionProperty = props.options?.rowSelectionProperty || 'id';
	const [selectedRows, setSelectedRows] = React.useState<Set<any>>(new Set());

	const isSelected = React.useCallback(
		(row: TableRow<T>) => selectedRows.has((row as any)[rowSelectionProperty]),
		[rowSelectionProperty, selectedRows],
	);
	const toggleRowSelection = React.useCallback((row: TableRow<T>, selected?: boolean) => {
		const rowIdentifier = row[rowSelectionProperty as keyof T];
		switch (selected) {
		case true:
			selectedRows.add(rowIdentifier);
			break;
		case false:
			selectedRows.delete(rowIdentifier);
			break;
		default:
			selectedRows.has(rowIdentifier) ? selectedRows.delete(rowIdentifier) : selectedRows.add(rowIdentifier);
		}
		setSelectedRows(new Set(selectedRows));
	}, [rowSelectionProperty, selectedRows]);

	// pagination
	const pageSizeOptions = React.useMemo(() => props.options?.pageSizeOptions || [10, 25, 50], [props.options]);
	const defaultPageSize = React.useMemo(() => props.options?.defaultPageSize || pageSizeOptions[0], [pageSizeOptions, props.options]);
	const [pagingOptions, setPagingOptions] = React.useState<PagingOptions>({
		page: 0,
		size: defaultPageSize,
	});
	const [loading, setLoading] = React.useState(false);
	const [tablePage, setTablePage] = React.useState<TablePage<T>>();
	const latestPromiseOrStream = React.useRef<Promise<TablePage<T>> | TablePageStream<T> | undefined>(undefined);
	const fetchTablePageFn = props.fetchTablePageFn;
	const fetchPage = React.useCallback(async() => {
		setLoading(true);
		if (!fetchTablePageFn) return;

		// ensure that only the last table page fetch call sets state
		const promiseOrStream = fetchTablePageFn(pagingOptions, tableSortOptions);
		latestPromiseOrStream.current = promiseOrStream;

		if ((promiseOrStream as any)['then'] !== undefined) {
			const promise = promiseOrStream as Promise<TablePage<T>>;
			const tablePage = await promise;
			if (latestPromiseOrStream.current === promise) {
				latestPromiseOrStream.current = undefined;
				setTablePage(tablePage);
				setLoading(false);
			}
		} else {
			const stream = promiseOrStream as TablePageStream<T>;
			stream((data, total) => {
				setTablePage({ data, total });
				setLoading(false);
			});
		}
	}, [fetchTablePageFn, pagingOptions, tableSortOptions]);
	React.useEffect(() => {
		fetchPage();
	}, [fetchPage]);

	return (
		<Paper className={clsx([classes.paper, props.className])} >
			<TableContainer>
				<MuiTable
					size={'small'}
				>
					<TableHeader
						columns={columnDefs}
						sortOptions={tableSortOptions}
						onSortChange={(sortBy: string) => updateSort(sortBy)}
						pageLoading={loading}
					/>
					<TableBody>
						{
							// loading ||
							!tablePage ?
								<PageLoadingProgress numColumns={columnDefs.length} numRows={10} />
								:
								<TableRows
									columns={columnDefs}
									rows={tablePage.data}
									onRowClick={() => { }}
									isRowSelected={isSelected}
									toggleRowSelection={toggleRowSelection}
									refreshPage={fetchPage}
								/>
						}
					</TableBody>
				</MuiTable>
			</TableContainer>
			<TablePagination
				labelRowsPerPage='Rows per page:'
				labelDisplayedRows={pagInfo => `${pagInfo.from}-${pagInfo.to} od ${pagInfo.count}`}
				rowsPerPageOptions={pageSizeOptions}
				component='div'
				count={tablePage?.total || 0}
				rowsPerPage={pagingOptions.size}
				page={pagingOptions.page}
				onChangePage={(_, number: number) => setPagingOptions(prev => ({ ...prev, page: number }))}
				onChangeRowsPerPage={e => {
					const size = parseInt(e.target.value, 10);
					setPagingOptions(prev => ({ ...prev, size }));
				}}
			/>
		</Paper>
	);
};

export const Column = <T,>(_props: ColumnProps<T>) => {
	return <></>;
};

const TestColumn = <Column field='test_column' />;

export default Table;

export const RowSelectionColumn = <T,>() => (
	<Column<T> width={1}>
		{(row, isSelected, toggleRowSelection) => <div>
			<Checkbox checked={isSelected} onChange={() => toggleRowSelection(row)} style={{ padding: 0 }} />
		</div>}
	</Column>
);

const dateToStringMap = {
	'time': (date: Date, locale: string) => date.toLocaleTimeString(locale),
	'date': (date: Date, locale: string) => date.toLocaleDateString(locale),
	'datetime': (date: Date, locale: string) => date.toLocaleString(locale),
};

export const DateColumn = <T,>(props: Omit<ColumnProps<T>, 'field' | 'children'> & { field: string; locale?: string; type?: 'time' | 'date' | 'datetime' }) => {
	return (
		<Column<T> {...props}>
			{row => {
				if (!row[props.field as keyof T] || !isValid(row[props.field as keyof T])) return <>/</>;
				return <>{dateToStringMap[props.type || 'datetime'](row[props.field as keyof T] as any as Date, props.locale || 'en')}</>;
			}
			}
		</Column>
	);
};
