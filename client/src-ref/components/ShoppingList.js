// import React, { Component } from "react";
// import { Container, ListGroup, ListGroupItem, Button, Alert } from "reactstrap";
// import { CSSTransition, TransitionGroup } from "react-transition-group";
// import { connect } from "react-redux";
// import { getBoards, deleteBoard } from "../actions/itemActions";
// import PropTypes from "prop-types";
// import Loading from './Loading';

// export class ShoppingList extends Component {
//     componentDidMount() {
//         // if (this.props.isAuthenticated)
//         //     this.props.getItems();
//     }

//     onDeleteClick = id => {
//         this.props.deleteItem(id);
//     };

//     static propTypes = {
//         getItems: PropTypes.func.isRequired,
//         item: PropTypes.object.isRequired,
//         isAuthenticated: PropTypes.bool,
//         isLoading: PropTypes.bool
//     };

//     render() {
//         const { items, loading } = this.props.item;
//         if (this.props.isLoading) return (<Loading msg="Logging you in.." />)
//         if (!this.props.isAuthenticated) return (<Alert color="info">Login to view your boards</Alert>)
//         return (
//             < Container >
//                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
//                     <h1 style={{ display: "inline", marginRight: '1rem', marginBottom: '0rem' }}>Your Boards</h1>
//                     {loading ? <Loading fill="inline" /> : null}
//                 </div>
//                 <ListGroup>
//                     <TransitionGroup className="shopping-list">
//                         {items.map(({ id, title }) => (
//                             <CSSTransition
//                                 key={id}
//                                 timeout={500}
//                                 classNames="fade"
//                             >
//                                 <ListGroupItem>
//                                     <Button
//                                         className="remove-btn mr-3"
//                                         color="danger"
//                                         size="sm"
//                                         onClick={this.onDeleteClick.bind(
//                                             this,
//                                             id
//                                         )}
//                                     >
//                                         &times;
//                                     </Button>

//                                     {title}
//                                 </ListGroupItem>
//                             </CSSTransition>
//                         ))}
//                     </TransitionGroup>
//                 </ListGroup>
//                 {(items.length === 0) ? <Alert color="info">You do not have any boards!</Alert> : null}
//             </Container >
//         );
//     }
// }

// const mapStateToProps = state => ({
//     item: state.item,
//     isAuthenticated: state.auth.isAuthenticated,
//     isLoading: state.auth.isLoading
// });

// export default connect(
//     mapStateToProps,
//     { getItems: getBoards, deleteItem: deleteBoard }
// )(ShoppingList);
