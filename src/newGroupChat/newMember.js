import React from 'react';
import { FormControl, InputLabel, Input, Button, Paper, withStyles, CssBaseline, Typography } from '@material-ui/core';
import styles from './styles';
const firebase = require("firebase");

class NewMemberComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            username: null,
            message: null
        };
    }

    render() {

        const { classes } = this.props;
        console.log("select"+this.props.selectedChatIndex);

        return(
            <main className={classes.main}>
                <CssBaseline/>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h5">Add Member</Typography>
                    <form className={classes.form} onSubmit={(e) => this.submitNewChat(e)}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor='new-chat-username'>
                                Enter NewMeber
                            </InputLabel>
                            <Input required
                                   className={classes.input}
                                   autoFocus
                                   onChange={(e) => this.userTyping('username', e)}
                                   id='new-chat-username'>
                            </Input>
                        </FormControl>
                        <Button fullWidth variant='contained' color='primary' className={classes.submit} type='submit'>Send</Button>
                    </form>
                    {
                        this.state.serverError ?
                            <Typography component='h5' variant='h6' className={classes.errorText}>
                                Unable to locate the user
                            </Typography> :
                            null
                    }
                </Paper>
            </main>
        );
    }

    componentWillMount() {
        if(!firebase.auth().currentUser)
            this.props.history.push('/login');
    }

    userTyping = (inputType, e) => {
        switch (inputType) {
            case 'username':
                this.setState({ username: e.target.value });
                break;

            // case 'message':
            //     this.setState({ message: e.target.value });
            //     break;

            default:
                break;
        }
    }

    submitNewChat = async (e) => {
        e.preventDefault();
        // this.createChat();
        const userExists = await this.userExists();
        // const chatExists = await this.userAllReadyExists();
        if(userExists ) {
            this.createChat();
           
            // chatExists ? this.goToChat() : ;
        }
    }

    // buildDocKey = () => [firebase.auth().currentUser.email, this.state.username].sort().join(':');

    createChat = () => {
        this.props.newChatGroupSubmitFn({
            sendTo: this.state.username,
            selectedChat:this.props.selectedChat
            // ,
            // message: this.state.message
        });
    }

    goToChat = () => this.props.goToChatFn(this.buildDocKey(), this.state.message);

    // chatExists = async () => {
    //     // const docKey = this.buildDocKey();
    //     const chat = await
    //         firebase
    //             .firestore()
    //             .collecton('chats/users')
    //             // .startAt('chat')
    //             // .endAt('users')
    //             .doc(this.state.username)
    //             .get();
    //     console.log(chat.exists);
    //     // return chat.exists;
    //     const exists = chat
    //         .docs
    //         .map(_doc => _doc.data().email)
    //         .includes(this.state.username);
    //     this.setState({ serverError: !exists });
    //     return exists;
    // }

    chatExists = async () => {
        const docKey = this.buildDocKey();
        const chat = await
            firebase
                .firestore()
                .collection('chats')
                .doc(docKey)
                .get();
        console.log(chat.exists);
        return chat.exists;
    }

    userAllReadyExists = async () => {
        // const docKey = this.buildDocKey();
        const usersSnapshot = await
            firebase
                .firestore()
                .collection('chats')
                .doc("AAAA")
                .get();
            console.log(usersSnapshot);
        // const exists = usersSnapshot
        //     .docs
        //     .map(_doc => _doc.data().lastmessage)
        //     .includes(this.state.username);
        // this.setState({ serverError: !exists });
        // return exists;
    }

    
    userExists = async () => {
        const usersSnapshot = await
            firebase
                .firestore()
                .collection('users')
                .get();
        const exists = usersSnapshot
            .docs
            .map(_doc => _doc.data().email)
            .includes(this.state.username);
        this.setState({ serverError: !exists });
        return exists;
    }
}

export default withStyles(styles)(NewMemberComponent);