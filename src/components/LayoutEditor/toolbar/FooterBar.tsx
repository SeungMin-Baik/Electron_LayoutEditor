import { List } from '@material-ui/core';
import React, { memo, useState }  from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
// import { createStructuredSelector } from 'reselect';
// import {  useStringResource } from '../resourceProvider/ResourceProvider';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';


export const Footerbar = () => {
    // const { getString } = useStringResource();
    return (
        <List className='menu-list'>
            <ZoomInIcon/>
            <ZoomOutIcon/>
            <ZoomOutMapIcon/>
        </List>
    );
};

// const mapStateToProps = createStructuredSelector({

// });

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
  )(Footerbar);
