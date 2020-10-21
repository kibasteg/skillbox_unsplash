import React from 'react';
import ReactDOM from 'react-dom';
import api from '../../api';
import {connect} from "react-redux";

const LikeWrapper = (WrapComponent) => {

    return class extends React.Component {

        constructor(props) {

            super(props);

            this.photoId = props.photoId;
            this.myLike = props.myLike;
            this.handleClick = this.handleClick.bind(this);

            this.state = {
                myLike: props.myLike || false,
                likes: props.likes || 0,
                likeInProcess: false
            };
        }

        handleClick(e) {

            e.preventDefault();

            if (this.state.likeInProcess)
                return;

            if (this.props.userStatus !== 'success') {
                alert('Sign in to be like');
                return;
            }

            this.setState({likeInProcess: true});

            const newLike = !this.state.myLike;

            api.setLike(this.photoId, newLike)
                .then(() => {

                    this.setState({
                        myLike: newLike,
                        likes: newLike ? this.state.likes + 1 : this.state.likes - 1,
                        likeInProcess: false,
                    });
                })
                .catch(e => {

                    alert('не удалось поставить лайк: ' + e.message);
                    this.setState({likeInProcess: false});
                });
        }

        componentDidMount() {

            ReactDOM.findDOMNode(this).onclick = this.handleClick;
        }

        render() {

            return (
                <React.Fragment>
                    <WrapComponent
                        {...this.props}
                        myLike={this.state.myLike}
                        likes={this.state.likes}
                        likeInProcess={this.state.likeInProcess} />
                </React.Fragment>
            )
        }
    };
};

const mapStateToProps = state => ({
    userStatus: state.user.userStatus
});

export default (WrapComponent) => connect(mapStateToProps)(LikeWrapper(WrapComponent));