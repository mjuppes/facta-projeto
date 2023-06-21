import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import {isMobile} from 'react-device-detect';
class LayoutFactaHeader extends Component {
  render() {
    return(
      <Row>
        <Col md="12" style={{ 'display' : isMobile ? 'block' : 'none' }}>
          <img src={ require('./assets/img/logo_topo.png') } alt="Logo" />
          <p className="text-white mb-3" style={{marginTop: '-10px'}}><i className="fa fa-lock"></i> | Site seguro</p>
        </Col>
      </Row>
    )
  }
}
export default LayoutFactaHeader;
