import { List } from '@material-ui/core';
import React, { memo, useState }  from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
// import { createStructuredSelector } from 'reselect';
// import {  useStringResource } from '../resourceProvider/ResourceProvider';
// import { RS } from "../../i18n/common";
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import VerticalAlignCenterIcon from '@material-ui/icons/VerticalAlignCenter';
import DeleteIcon from '@material-ui/icons/Delete';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';

// Stylesheet
import './MenuBar.scss';

export const MenuBar = () => {
    // const { getString } = useStringResource();
    return (
        <List className='menu-list-cls'>
            <FlipCameraIosIcon/>
            <FormatAlignCenterIcon/>
            <FormatAlignJustifyIcon/>
            <FormatAlignLeftIcon/>
            <FormatAlignRightIcon/>
            <VerticalAlignCenterIcon/>
            <FormatAlignCenterIcon/>
            <UndoIcon/>
            <RedoIcon/>
            <DeleteIcon/>
        </List>
    );
};

// const mapStateToProps = createStructuredSelector({

//   });

  export function mapDispatchToProps(dispatch: any) {
    return {
    };
  }

  const withConnect = connect(
    // mapStateToProps,
    mapDispatchToProps,
  );

  export default compose(
    withConnect,
    memo,
  )(MenuBar);
