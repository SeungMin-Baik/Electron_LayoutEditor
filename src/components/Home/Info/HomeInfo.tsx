import * as React from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { HomeDataList } from '../Info';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import { RouteComponentProps } from 'react-router';
import HomeInfoFoot from './HomeInfoFoot';
import HomeInfoHead from './HomeInfoHead';

import { getElectronDataPath } from '@app/utils/main/others';

import store from '@app/store';

import './HomeInfo.scss';
import HomeInfoBody from './HomeInfoBody';

type HomeInfoProps = {} & RouteComponentProps;

type HomeInfotStates = {
};

class HomeInfo extends React.Component<HomeInfoProps, HomeInfotStates> {

    constructor(props: HomeInfoProps) {
        super(props);
        this.state = {
            cublickStore: []
        };
    }

    render() {

        return (
        <>
        <HomeInfoHead />
        <HomeInfoFoot />
        </>

        );

    }
}

export default HomeInfo;