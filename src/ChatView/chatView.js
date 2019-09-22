import React from 'react';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';
// import SimpleModalLauncher from "./SimpleModalLauncher/SimpleModalLauncher";
import SimpleModalLauncher from "../SimpleModalLauncher/SimpleModalLauncher";
import Button from '@material-ui/core/Button';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Widget } from 'react-chat-widget';
import Modal from '@material-ui/core/Modal';

class ChatViewComponent extends React.Component {
    constructor() {
        super();
        this.state = { isOpen: false, isId:""};
    }

    handleShowDialog = (index) => {
        this.setState({ isOpen: !this.state.isOpen, isId:index});
        console.log("cliked");
      };

    componentDidMount = () => {
        const container = document.getElementById('chatview-container');
        if(container)
            container.scrollTo(0, container.scrollHeight);
    }
    componentDidUpdate = () => {
        const container = document.getElementById('chatview-container');
        if(container)
            container.scrollTo(0, container.scrollHeight);
    }

    render() {

        const { classes } = this.props;
        const {open} = true;

        // const handleOpen = () => {
        //   setOpen(true);
        // };
      
        const handleClose = () => {
        //   setOpen(false);
        };


        if(this.props.chat === undefined) {
            return(<main className={classes.content}></main>);
        } else if(this.props.chat !== undefined) {
            return(

                <div>
                    <div className={classes.chatHeader}>
                        {this.props.chat.type =="Group"?  <div>
                        Your conversation with {this.props.chat.name}
                        </div>:
                        <div>
                        Your conversation with {this.props.chat.users.filter(_usr => _usr !== this.props.user)[0]}
                        </div>
                            }
                        {/* <Button variant="contained"
                            fullWidth
                            color='primary'
                            onClick={this.newChatGroup}
                            className={classes.newChatBtn}>
                        Add New Member
                    </Button> */}
                    </div>
                    <main id='chatview-container' className={classes.content}>
                        
                        {this.props.chat.messages?
                            this.props.chat.messages.map((_msg, _index) => {

                                // var matches = _msg.message.match("https://firebasestorage.googleapis.com");
                                
                                if(_msg.type === 2){
                                    return(
                                  
         
         <div key={_index} className={_msg.sender === this.props.user ? classes.friendSent : classes.userSent}>
             <ListItemAvatar>
                                                <Avatar alt="Remy Sharp">{_msg.sender.split('')[0]}</Avatar>
                                            </ListItemAvatar>
             {!this.state.isOpen &&  (
                  <SimpleModalLauncher buttonLabel="Open image modal" image={_msg.message}>
      <div className={classes.imageModal}>
        <img
          className={classes.imageInModal}
          src={_msg.message}
          alt="Nature"
        />
      </div>
    </SimpleModalLauncher>
    
             )}

           
      </div>
                                    )
                                }
                                else if(_msg.type === 3){
                                    return(
                                        <div key={_index} className={_msg.sender === this.props.user ? classes.friendSent : classes.userSent}>
                                          <ListItemAvatar>
                                                <Avatar alt="Remy Sharp">{_msg.sender.split('')[0]}</Avatar>
                                            </ListItemAvatar>
                                            <a href={ _msg.message } download target="_blank" >Click to download</a>
                                      
                                   </div>
                                    )

                                }
                                else{
                                    return(
                                        <div>
                                        
                                        <div key={_index} className={_msg.sender === this.props.user ? classes.friendSent : classes.userSent}>
                            
                                      
                                        <ListItemAvatar>
                                                <Avatar alt="Remy Sharp">{_msg.sender.split('')[0]}</Avatar>
                                            </ListItemAvatar>
                                       {_msg.message}
                                   </div>
                                   </div>
                                    )
                                   
                                }
                            }):null
                        }
                    </main>
                </div>

            );
        } else {
            return (<div className='chatview-container'>Loading...</div>);
        }
    }
    newChatGroup = () => this.props.newChatGroupBtnFn();
}

export default withStyles(styles)(ChatViewComponent);
