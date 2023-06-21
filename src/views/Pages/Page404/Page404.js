import React, { Component } from 'react';
import { Col, Row, Container, Card, CardBody } from 'reactstrap';
import LayoutFactaHeader from '../../../LayoutFactaHeader';
class Page404 extends Component {


  
  render() {
    const containerPaddingTop = {
      "paddingTop": "5%",
      "display": 'block',
      "background": 'linear-gradient(-45deg, #B0DACC 0%, #3D8EB9 60%)',
      "fontFamily": 'Montserrat,sans-serif',
      "letterSpacing" : '-1px'
    };
    return(
      <Col className="w-100 p-3 min-vh-100 text-center" style={containerPaddingTop}>
        <LayoutFactaHeader />
        <Row className="mt-4">
          <Col md={{size: 6, offset: 3}}>
            <Card className="border-white shadow" style={{borderRadius: '8px'}}>
              <CardBody>

                  <Row className="mt-3 text-justify">
                    <Col xs="12" sm="12">
                      <p className="text-center text-muted">Sistema Indisponível no momento, tente mais tarde!!</p>
                    </Col>
                  </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
    )
  }
}
export default Page404;

