import React, { Component } from 'react';
import { Col, Row, Container } from 'reactstrap';
class LayoutFactaCarregando extends Component {
  render() {
    return(
      <Container className="flex-row align-items-center m-auto">
        <Row className="text-center">
          <Col md="12" lg="12" xl="12">
            <div className="spinner-border text-info">
              <span className="sr-only">Carregando...</span>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}
export default LayoutFactaCarregando;
