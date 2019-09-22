import React from 'react';
import { FormControl, InputLabel, Input, Button, Paper, withStyles, CssBaseline, Typography } from '@material-ui/core';
import styles from './styles';
const firebase = require("firebase");

class NewChatGroupComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            groupName:null,
            username: null,
            users:[],
            message: null
        };
    }

    render() {

        const { classes } = this.props;

        return(
            <main className={classes.main}>
                <CssBaseline/>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h5">Make A New Group</Typography>
                    <form className={classes.form} onSubmit={(e) => this.submitNewChat(e)}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor='new-chat-username'>
                                Enter Group Name
                            </InputLabel>
                            <Input required
                                   className={classes.input}
                                   autoFocus
                                   onChange={(e) => this.userTyping('groupName', e)}
                                   id='new-chat-username'>
                            </Input>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel htmlFor='new-chat-username'>
                                Enter Your Friend's Email
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
                // if( !e.target.value.includes(",")){
                this.setState({ username: e.target.value });
                // }
                // else{
                //     this.setState({username: e.target.value.split(",")});
                // }
                break;

            case 'groupName':
                this.setState({ groupName: e.target.value });
                break;

            default:
                break;
        }
    }

    submitNewChat = async (e) => {
        e.preventDefault();
        // this.createChat();
        const userExists = await this.userExists();
        if(userExists) {
            this.createChat();
        }
    }

    // buildDocKey = () => [firebase.auth().currentUser.email, this.state.username].sort().join(':');

    createChat = () => {
        this.props.newChatGroupSubmitFn({
            sendTo: this.state.username,
            
            message: this.state.groupName
        });
    }

    goToChat = () => this.props.goToChatFn(this.buildDocKey(), this.state.message);

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

export default withStyles(styles)(NewChatGroupComponent);