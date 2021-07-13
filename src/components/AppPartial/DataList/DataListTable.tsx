import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons/faChevronRight';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import isObject from 'lodash-es/isObject';

import { APIList, APIListParams } from '@app/apis';

import './DataListTable.scss';


/** States of `DataListTable` component. */
type DataListTableProps = {
    /** Table head items. */
    head: string[] | JSX.Element[];
    /** Default sort. */
    defaultSort: {
        /** Sort */
        sort: string;
        /** Order */
        order: 'ASC' | 'DESC'
    };
    /** Method to fetch data. */
    // api: (params: APIListParams) => Promise<APIList<any>>;
    // /** On api fetch. */
    // onApiFetch?: (data: any[]) => void;
};

/** States of `DataListTable` component. */
type DataListTableStates = {
    /** Page number to fetch data. */
    apiListPage: number;
    /** Data counts to fetch per page. */
    apiListPerPage: number;
    /** Fetched data list result. */
    apiRes: APIList<any>;
    /** Status of api result. */
    apiResStatus: 'LOAD' | 'ERR' | '';
};

class DataListTable extends React.Component<DataListTableProps, DataListTableStates> {
    /** Default data result. */
    private readonly DEFAULT_API_RES: APIList<any> = {
        data: [],
        pages: {
            current: 0,
            hasNext: false,
            hasPrev: false,
            next: 0,
            prev: 0,
            total: 0
        },
        items: {
            begin: 0,
            end: 0,
            total: 0
        }
    };
    /** Options for per page. */
    private readonly PER_PAGE_OPTIONS = [10, 15, 20];
    constructor(props: DataListTableProps) {
        super(props);
        // this.onPageChange = this.onPageChange.bind(this);
        // this.onPerPageChange = this.onPerPageChange.bind(this);
        this.state = {
            apiListPage: 1,
            apiListPerPage: 10,
            apiRes: this.DEFAULT_API_RES,
            apiResStatus: ''
        };
    }

    componentWillMount() {
        this.getParamsFromUrl();
    }

    componentDidMount() {
        // this.callApiToFetch();
    }

    render() {
        /** Messages for table body. */
        const tBodyMsg = (
            this.state.apiResStatus === 'ERR' ?
                // On error
                <>
                    <FormattedMessage
                        id='app-partial.datalist.msg-error'
                        defaultMessage='Error'
                    />
                </>
            :
                this.state.apiResStatus === 'LOAD' ?
                    // On loading
                    <>
                        <CircularProgress />
                    </>
                :
                    !this.state.apiRes.data.length ?
                        // Empty data
                        <>
                            <FormattedMessage
                                id='app-partial.datalist.msg-empty'
                                defaultMessage='Empty data'
                            />
                        </>
                    :
                        null
        );

        /** Table footer. */
        // const tfoot = (
        //     <div className='table-pagination'>

        //         {/* Pagination : Per-page */}
        //         <div className='pagination-perpage'>
        //             <FormattedMessage
        //                 id='app-partial.datalist.perPage'
        //                 defaultMessage='Items per page'
        //             />
        //             <span>:</span>
        //             <Select
        //                 className='perpage-select'
        //                 value={this.state.apiListPerPage}
        //                 onChange={this.onPerPageChange}
        //             >
        //                 {this.PER_PAGE_OPTIONS.map(pp =>
        //                     <MenuItem key={pp} value={pp}>
        //                         {pp}
        //                     </MenuItem>
        //                 )}
        //             </Select>
        //         </div>

        //         {/* Pagination : Item range */}
        //         <div className='pagination-range'>
        //             <span>
        //                 {this.state.apiRes.items.begin}
        //                 &nbsp;-&nbsp;
        //                 {this.state.apiRes.items.end}
        //             </span>
        //             <FormattedMessage
        //                 id='app-partial.datalist.of'
        //                 defaultMessage='of'
        //             />
        //             <span>{this.state.apiRes.items.total}</span>
        //         </div>

        //         {/* Pagination : Button */}
        //         <div className='pagination-button'>
        //             <IconButton onClick={e => this.onPageChange(
        //                     e, this.state.apiRes.pages.prev
        //                 )}
        //                 disabled={!this.state.apiRes.pages.hasPrev}
        //             >
        //                 <FontAwesomeIcon icon={faChevronLeft} />
        //             </IconButton>
        //             <IconButton onClick={e => this.onPageChange(
        //                     e, this.state.apiRes.pages.next
        //                 )}
        //                 disabled={!this.state.apiRes.pages.hasNext}
        //             >
        //                 <FontAwesomeIcon icon={faChevronRight} />
        //             </IconButton>
        //         </div>

        //     </div>
        // );

        return (
            <div className='cbkApp-DataListTable'>
                <Table>
                    <TableHead>
                        <TableRow>
                            {(this.props.head as any[]).map((item, idx) =>
                                <TableCell key={idx}>
                                    {item}
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Table data. */}
                        {this.props.children}

                        {/* Table overlay message. */}
                        {/* <tr className='table-overlay-msg'
                            style={{
                                opacity: this.state.apiResStatus ||
                                    this.state.apiRes.data && !this.state.apiRes.data.length ?
                                        1 : 0
                            }}
                        >
                            <td>{ tBodyMsg }</td>
                        </tr> */}

                        {/* Table dummy cell for empty data. */}
                        {/* {
                            !this.state.apiRes.data.length ?
                                <tr className='table-overlay-msg-dummy'>
                                    <td />
                                </tr>
                            :
                                null
                        } */}
                    </TableBody>
                </Table>
                {/* { tfoot } */}
            </div>
        );
    }

    /**
     * Get list parameter from URL.
     */
    private getParamsFromUrl() {
        // Get search parameter.
        const searchParams = new URLSearchParams(window.location.search);

        // Set list params.
        this.setState({
            apiListPage:
                !isNaN(+searchParams.get('p')) && +searchParams.get('p') > 0 ?
                    +searchParams.get('p') : 1,
            apiListPerPage:
                !isNaN(+ searchParams.get('pr')) && +searchParams.get('pr') > 0  ?
                    +searchParams.get('pr') : 10
        });
    }
}

export default DataListTable;
