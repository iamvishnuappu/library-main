import React from 'react';
import {
  Card,
  Container,
  Row,
  Col,
  Button
} from "react-bootstrap";

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      searchKey: ""
    };
    this.updateInput = this.updateInput.bind(this);
    this.searchBooks = this.searchBooks.bind(this);
  }

  updateInput(e) {
    this.setState({ searchKey: e.target.value });
  }

  searchBooks() {

    this.setState({
      isLoaded: true
    });

    let baseUrl = "http://openlibrary.org/search.json?q="
    let key = this.state.searchKey.trim().replace("  ", " ").replace(" ", "+")

    fetch(baseUrl+key)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.docs
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;

    if (!isLoaded) {
      return (
        <Container>
          <Row>
            <Col sm={6}>
              <label>
                <input type="text" name="" placeholder="Search books here" onChange={ this.updateInput } />
              </label>
              <Button variant="primary" onClick = { this.searchBooks }>Search</Button>
            </Col>
          </Row>
        </Container>
      )
    } else {
      return (
        <Container>
          
          <Row>
            <Col sm={6}>
              <label>
                <input type="text" name="" placeholder="Search books here" onChange={ this.updateInput } />
              </label>
              <Button variant="primary" onClick = { this.searchBooks }>Search</Button>
            </Col>
          </Row>

          <Row className="justify-content-md-center">
            
            {this.state.items.map(item => (
              <div key={item.key}>
                <Col sm={3}>
                  <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={ "http://covers.openlibrary.org/b/id/"+item.cover_i+"-M.jpg"} />
                    <Card.Body>
                      <Card.Title>{ item.title }</Card.Title>
                      <Card.Text>Author: { item.author_name }</Card.Text>
                      <Card.Text>Published Date: { item.publish_date != undefined && item.publish_date[0] }</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </div>
            ))}

          </Row>
        </Container>
      );
    }
  }
}

export default MyComponent;