import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import styles from './styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NotificationImportant from '@material-ui/icons/NotificationImportant';

class ChatListComponent extends React.Component {

    render() {

        const { classes } = this.props;
        console.log("users"+this.props.chats[0].users);

        if(this.props.chats.length > 0) {
            return(
                <div className={classes.root}>
                    <Button variant="contained"
                            fullWidth
                            color='primary'
                            onClick={this.newChat}
                            className={classes.newChatBtn}>
                        New Message
                    </Button>
                    <Button variant="contained"
                            fullWidth
                            color='primary'
                            onClick={this.newChatGroup}
                            className={classes.newChatBtn}>
                        Add New Group
                    </Button>
                    <List>
                        {
                            this.props.chats.map((_chat, _index) => {
                                if(_chat.users.indexOf(this.props.userEmail) !== -1){
                                    return (



                                        <div key={_index}>
                                            <ListItem onClick={() => this.selectChat(_index)}
                                                      className={classes.listItem}
                                                      selected={this.props.selectedChatIndex === _index}
                                                      alignItems="flex-start">
                                                {_chat.type !== "Group" ?
                                                    <ListItemAvatar>
                                                        <Avatar alt="Remy Sharp">{_chat.users.filter(_user => _user !== this.props.userEmail)[0].split('')[0]}</Avatar>
                                                    </ListItemAvatar>:
                                                    <ListItemAvatar>
                                                        <Avatar alt="Remy Sharp">{_chat.name.split('')[0]}</Avatar>
                                                    </ListItemAvatar>


                                                }
                                                {_chat.type !== "Group" ?
                                                    <ListItemText
                                                        primary={_chat.users.filter(_user => _user !== this.props.userEmail)[0]}
                                                        secondary={
                                                            <React.Fragment>
                                                                <Typography component='span'
                                                                            color='textPrimary'>
                                                                    {_chat.messages[_chat.messages.length - 1].message.substring(0, 30) + ' ...'}
                                                                </Typography>
                                                            </React.Fragment>
                                                        }/>:
                                                    <ListItemText
                                                        primary={_chat.name}
                                                        secondary={
                                                            <React.Fragment>
                                                                {_chat.message ?
                                                                    <Typography component='span'
                                                                                color='textPrimary'>
                                                                        {_chat.messages[_chat.messages.length - 1].message.substring(0, 30) + ' ...'}
                                                                    </Typography> :null}
                                                            </React.Fragment>
                                                        }/>
                                                }

                                                {
                                                    _chat.receiverHasRead === false && !this.userIsSender(_chat) ?
                                                        <ListItemIcon><NotificationImportant className={classes.unreadMessage}></NotificationImportant></ListItemIcon> :
                                                        null
                                                }
                                                {
                                                    _chat.type === "Group" && !_chat.receiver.includes(this.props.userEmail)?
                                                        <ListItemIcon><NotificationImportant className={classes.unreadMessage}></NotificationImportant></ListItemIcon>
                                                        :
                                                        null
                                                }
                                            </ListItem>
                                            <Divider/>
                                        </div>
                                    )}
                            })
                        }
                    </List>
                </div>
            );
        } else {
            return(
                <div className={classes.root}>
                    <Button variant="contained"
                            fullWidth
                            color='primary'
                            onClick={this.newChat}
                            className={classes.newChatBtn}>
                        New Message
                    </Button>
                    <List></List>
                </div>
            );
        }
    }
    userIsSender = (chat) => chat.messages[chat.messages.length - 1].sender === this.props.userEmail;
    newChat = () => this.props.newChatBtnFn();
    newChatGroup = () => this.props.newChatGroupBtnFn();
    selectChat = (index) => this.props.selectChatFn(index);
}

export default withStyles(styles)(ChatListComponent);





