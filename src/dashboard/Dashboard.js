import React from 'react';
import NewChatComponent from '../NewChat/newChat';
import NewChatGroupComponent from '../newGroupChat/newGroupChat';
import NewMemberComponent from '../newGroupChat/newMember';
import ChatListComponent from '../ChatList/chatList';
import ChatViewComponent from '../ChatView/chatView';
import ChatTextBoxComponent from '../ChatTextBox/chatTextBox';



import styles from './style';
import { Button, withStyles } from '@material-ui/core';
const firebase = require("firebase");

// I need to investigate why sometimes
// two messages will send instead of just
// one. I dont know if there are two instances
// of the chat box component or what...

// I will be using both .then and async/await
// in this tutorial to give a feel of both.

class DashboardComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            selectedChat: null,
            newChatFormVisible: false,
            newChatGroupVisible:false,
            addMember:false,
            lastmessage:null,
            email: null,
            friends: [],
            chats: []
        };
    }

    render() {

        const { classes } = this.props;


        if(this.state.email) {
            return(
                <div className={classes.container}  id='dashboard-container'>
                    <ChatListComponent history={this.props.history}
                                       userEmail={this.state.email}
                                       selectChatFn={this.selectChat}
                                       chats={this.state.chats}
                                       selectedChatIndex={this.state.selectedChat}
                                       newChatBtnFn={this.newChatBtnClicked}
                                       newChatGroupBtnFn={this.newChatGroupBtnClicked}
                    >
                        >
                    </ChatListComponent>
                    {/* {
                        this.state.newChatFormVisible ? null : <ChatHeader
                            user={this.state.email}
                            chat={this.state.chats[this.state.selectedChat]}
                            newChatGroupBtnFn={this.newMember}
                            >
                        </ChatHeader>
                    } */}
                    {
                        this.state.newChatFormVisible ? null : <ChatViewComponent
                            user={this.state.email}
                            chat={this.state.chats[this.state.selectedChat]}
                            newChatGroupBtnFn={this.newMember}
                        >
                        </ChatViewComponent>
                    }
                    {
                        this.state.selectedChat !== null && !this.state.newChatFormVisible ? <ChatTextBoxComponent userClickedInputFn={this.messageRead} submitMessageFn={this.submitMessage} newChatGroupBtnFn={this.newMember} selectedChatIndex={this.state.selectedChat} chats={this.state.chats} ></ChatTextBoxComponent> : null
                    }
                    {
                        this.state.newChatFormVisible ? <NewChatComponent goToChatFn={this.goToChat} newChatSubmitFn={this.newChatSubmit}></NewChatComponent> : null
                    }
                    {
                        this.state.newChatGroupVisible ? <NewChatGroupComponent  newChatGroupSubmitFn={this.newChatGroupSubmit}></NewChatGroupComponent> : null
                    }
                    {
                        this.state.addMember ? <NewMemberComponent  newChatGroupSubmitFn={this.addMember}  selectedChatIndex={this.state.selectedChat}></NewMemberComponent> : null
                    }
                    <Button onClick={this.signOut} className={classes.signOutBtn}>Sign Out</Button>
                </div>
            );
        } else {
            return(<div>LOADING....</div>);
        }
    }

    signOut = () => firebase.auth().signOut();

    submitMessage = (msg, type,selectedChatIndex) => {
        console.log("index:" +selectedChatIndex);

        console.log(this.state.chats[this.state.selectedChat])
        console.log(this.state.selectedChat);
        let docKey;
        {this.state.chats[this.state.selectedChat].name? docKey=this.state.chats[this.state.selectedChat].name
            :

            docKey = this.buildDocKey(this.state.chats[this.state.selectedChat]
                .users
                .filter(_usr => _usr !== this.state.email)[0])
        }
        //  docKey = this.buildDocKey(this.state.chats[this.state.selectedChat]
        //     .users
        //     .filter(_usr => _usr !== this.state.email)[0])
        {this.state.chats[this.state.selectedChat].name?

            firebase
                .firestore()
                .collection('chats')
                .doc(docKey)
                .update({
                    messages: firebase.firestore.FieldValue.arrayUnion({
                        sender: this.state.email,
                        message: msg,
                        type:type,
                        timestamp: Date.now()
                    }),
                    receiver: [this.state.email],
                    lastmessage:Date.now(),
                })
                :
                
            firebase
                .firestore()
                .collection('chats')
                .doc(docKey)
                .update({
                    messages: firebase.firestore.FieldValue.arrayUnion({
                        sender: this.state.email,
                        message: msg,
                        type:type,
                        timestamp: Date.now()
                    }),
                    lastmessage:Date.now(),
                    receiverHasRead: false
                })

        }
        this.selectChat(0);

        console.log("chat sumbit");
    }

    // Always in alphabetical order:
    // 'user1:user2'
    buildDocKey = (friend) => [this.state.email, friend].sort().join(':');
    buildDocKeyGroup = (friend) => [friend].toString();

    newChatBtnClicked = () => this.setState({ newChatFormVisible: true, selectedChat: null, newChatGroupVisible:false, addMember:false });

    newChatGroupBtnClicked = () => this.setState({ newChatFormVisible: false, selectedChat: null,newChatGroupVisible:true, addMember:false  });

    newMember = () => this.setState({ newChatFormVisible: false, selectedChat: this.state.selectedChat,newChatGroupVisible:false, addMember:true  });

    newChatSubmit = async (chatObj) => {
        const docKey = this.buildDocKey(chatObj.sendTo);
        await
            firebase
                .firestore()
                .collection('chats')
                .doc(docKey)
                .set({
                    messages: [{
                        message: chatObj.message,
                        sender: this.state.email,
                        type:1,
                        timestamp: Date.now()
                    }],
                    lastmessage:Date.now(),
                    users: [this.state.email, chatObj.sendTo],
                    receiverHasRead: false
                })
        this.setState({ newChatFormVisible: false });
     this.selectChat(0);
    }

    newChatGroupSubmit = async (chatObj) => {
        const docKey = this.buildDocKeyGroup(chatObj.message);
        await
            firebase
                .firestore()
                .collection('chats')
                .doc(docKey)
                .set({
                    messages: [{
                        message:"Wel Come",
                        sender: this.state.email,
                        type:1,
                        timestamp: Date.now()
                    }],
                    lastmessage:Date.now(),
                    name:chatObj.message,
                    users: [this.state.email, chatObj.sendTo],
                    type:"Group",
                    receiver:[this.state.email]
                    // receiverHasRead: false
                })
        this.setState({ newChatGroupVisible: false });
        // this.selectChat(this.state.chats.length - 1);
    }

    addMember =  (chatObj) => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].name);
        console.log(docKey);
        firebase
            .firestore()
            .collection('chats')
            .doc(this.state.chats[this.state.selectedChat].name)
            .update({
                users:firebase.firestore.FieldValue.arrayUnion(chatObj.sendTo),
            }).catch(e => {
            console.log("eeeeeeee",e)
        })
        console.log("finish")
        this.setState({ addMember: false });
        // this.selectChat(this.state.chats.length - 1);


    }

    selectChat = async (chatIndex) => {
        await this.setState({ selectedChat: chatIndex, newChatFormVisible: false, newChatGroupVisible:false, addMember:false });
        this.messageRead();
    }

    goToChat = async (docKey, msg) => {
        const usersInChat = docKey.split(':');
        const chat = this.state.chats.find(_chat => usersInChat.every(_user => _chat.users.includes(_user)));
        this.setState({ newChatFormVisible: false });
        await this.selectChat(this.state.chats.indexOf(chat));
        this.submitMessage(msg, 1);
    }

    // Chat index could be different than the one we are currently on in the case
    // that we are calling this function from within a loop such as the chatList.
    // So we will set a default value and can overwrite it when necessary.
    messageRead = () => {
        console.log("message read")
        const chatIndex = this.state.selectedChat;
        console.log(chatIndex);
        if(!this.state.chats[chatIndex].name){

            const docKey = this.buildDocKey(this.state.chats[chatIndex].users.filter(_usr => _usr !== this.state.email)[0]);
            if(this.clickedMessageWhereNotSender(chatIndex)) {
                firebase
                    .firestore()
                    .collection('chats')
                    // .orderBy('lastmessage')
                    .doc(docKey)
                    .update({ receiverHasRead: true });

                // receiver: [this.state.email]
            } else {
                console.log('Clicked message where the user was the sender');
            }
        }else{
            console.log("name"+this.state.chats[chatIndex].name)
            const docKey = this.state.chats[this.state.selectedChat].name;
            if(this.clickedMessageWhereNotSender(chatIndex)) {
                firebase
                    .firestore()
                    .collection('chats')
                    .doc(docKey)

                    .update({ receiver:firebase.firestore.FieldValue.arrayUnion(this.state.email) });

                // receiver: [this.state.email]
            } else {
                console.log('Clicked message where the user was the sender');
            }

        }
        // const docKey = this.buildDocKey(this.state.chats[chatIndex].users.filter(_usr => _usr !== this.state.email)[0]);
        // if(this.clickedMessageWhereNotSender(chatIndex)) {
        //     firebase
        //         .firestore()
        //         .collection('chats')
        //         .doc(docKey)
        //         .update({ receiverHasRead: true });
        // } else {
        //     console.log('Clicked message where the user was the sender');
        // }
    }


    clickedMessageWhereNotSender = (chatIndex) => this.state.chats[chatIndex].messages[this.state.chats[chatIndex].messages.length - 1].sender !== this.state.email;

    componentWillMount = () => {
        firebase.auth().onAuthStateChanged(async _usr => {
            if(!_usr)
                this.props.history.push('/login');
            else {
                await firebase
                    .firestore()
                    .collection('chats')
                    // .where('users', 'array-contains', _usr.email)
                    .orderBy('lastmessage', 'desc')
                    .onSnapshot(async res => {
                        const chats = res.docs.map(_doc => _doc.data());
                        await this.setState({
                            email: _usr.email,
                            chats: chats,
                            // lastmessage:lastmessage,
                            friends: []
                        });
                        chats.map((_chat, _index) =>{
                            console.log(_chat.lastmessage);
                        })

                    })

                    console.log("chattttt");

            }
        });
    }
}

export default withStyles(styles)(DashboardComponent);
