import fromNow from "../../lib/sanMoji/js/timeSince.js";
import utilities from "../../utilities/utilities.js";

const chat = {
    render: async () => {
        let chat =  `
            <div class="chat-wrapper">
                <div class="chat-container">
                    <div class="wrapper">
                        <div class="header" id="fc_header">
                            <span class="back-btn" id="chat-back-btn">
                                <img src="/src/icons/back-arrow.svg" alt="Back" />
                            </span>
                        </div>
                        <div class="msg-container" id="msg-container">
                        </div>
                        <div class="reply-handle" style="display:none" id="reply-handle">
                        </div>
                        <div class="input-container">
                            <div class="input-wrapper">
                                <input type="text" id="msg_input" autofocus="true" placeholder="Message @" />
                            </div>
                            <div class="input-btn-container">
                                <span class="input-btn" id="moji-btn">
                                    <img src="/src/icons/moji.svg" alt="😄" />
                                </span>
                                <span class="input-btn" id="img-toggle">
                                    <img src="/src/icons/image.svg" alt="🏞️" />
                                </span>                                    
                            </div>
                        </div>
                    </div>
                    <span class="spike"></span> 
                    <div class="participant-container">
                        <div class="header">
                            <span class="title">Members</span>
                        </div>
                        <span class="hr-spike"></span>
                        <div class="participant_list_container" id="participant_list_container">
                            <!--<div class="participants-prof-cont"  id="">
                                <span class="participants-pfp" style="background-image: url('/src/imgs/avatar.svg');">
                                </span>
                                <span class="participants-name">Blee<span class="id">#434</span></span>
                            </div>
                            <div class="participants-prof-cont"  id="">
                                <span class="participants-pfp" style="background-image: url('/src/imgs/avatar.svg');">
                                </span>
                                <span class="participants-name">Konisa<span class="id">#228</span></span>
                            </div> -->
                        </div>
                    </div>
                </div>
                <div class="image-input-wrapper" id="image-picker-cont">
                    <div class="image-picker" id="img-picker">
                        <div class="picker-wrapper">
                            <div class="picker-cont">
                                <label for="image-file" class="picker">
                                    <img src="/src/icons/upload.svg" />
                                </label>
                                <input type="file" id="image-file" hidden accept="image/png, image/jpeg"/>
                            </div>
                            <span>Click to upload file</span>
                        </div>
                    </div>
                    <div class="image-displayer" id="img-displayer">
                        <div class="displayer" id="displayer" style="background-image:url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.KvgBcaaAFQGRpQivDROUdQHaE7%26pid%3DApi&f=1&ipt=1936762ebdbd41e8cb28f931b534faa599ee38e9225259a1aadeb6f27987d09d&ipo=images')">
                            <span class="display-layer-prog" id="_prog-layer"></span>
                        </div>
                        <input class="descr" id="file-desc" placeholder="  Enter description"></input>
                        <div class="prog-cont">
                            <span class="prog-bg">
                                <span class="prog-bar" id="_prog-bar"></span>
                            </span>
                        </div>
                        <span class="cancel-btn" id="cancel-btn">
                            <img src="/src/icons/cancel.svg" />
                        </span>
                    </div>
                    <div class="image-picker-error" id="img-picker-error">
                        <div class="picker-wrapper">
                            <div class="picker-cont">
                                <label for="image-file" class="picker">
                                    <img src="/src/icons/retry.svg" />
                                </label>
                                <input type="file" id="image-file" hidden accept="image/png, image/jpeg"/>
                            </div>
                            <span>Something went wrong!</span>
                        </div>
                    </div>
                    <span class="spinn" id="spin">
                        <img src="/src/assets/spinner-1.svg" />
                    </span>
                </div>
            </div>
        `;
        return chat;
    },
    after_render: async () => {
        $('#spinnerx').removeClass('load');
        if($('#spinnerx').length > 0){
            $('#spinnerx').removeClass('show');
        }
        console.log('Chat page')
        let auth = firebase.auth(),
        _fsDb = firebase.firestore(),
        _fstrg = firebase.storage(),
        _rtDb = firebase.database();

        let _lstrg = localStorage;
        let _usr_ = _lstrg.getItem('deamon');
        const _client_ = firebase.firestore().collection('/client').doc(_usr_).collection(_usr_);

        let __msgCont = document.getElementById('msg-container'),
            __msgH = document.getElementById('');
      
        const getChats = {
            renderChat: {
                renderHeader: () => {
                    let _fray = _lstrg.getItem('_fRay');
                    console.log(_fray)

                    _fsDb.collection('/client').doc(_fray).collection(_fray)
                    .doc('udata').get()
                    .then(fsn => {
                        const fsVal = fsn.data();

                        let _fHC = `
                            <div class="f-pf-cont">
                                <span class="f-name">${fsVal.user}</span>
                                <span class="status ${fsVal.active == true ? 'online' : 'offline'}">
                                    <span class="tag-lock"></span>
                                    <span>${fsVal.active == true ? 'Online' : 'Offline'}</span>
                                </span>
                            </div>
                        `
                        document.getElementById('fc_header').innerHTML += _fHC;
                        // console.log(fsVal.user)
                        document.title = `Nimo - Chat 〔 ${fsVal.user} 〕`
                        document.getElementById('msg_input').setAttribute('placeholder', `Message @${fsVal.user}`);
                        document.getElementById('chat-back-btn').addEventListener('click', () => {
                            window.history.back();
                        })
                    })

                    document.querySelector('#chat-back-btn').addEventListener('click', () => {
                        console.log('helloo backin')
                    })
                },
                renderMesg: () => {
                    let _chat_content_container = document.querySelector('#msg-container');
                    let fcRay = _lstrg.getItem('_fcRay');
                    console.log('Friendchat ray :: '+fcRay)
                    let switchRay = 0;
                    
                    const _msgInput = document.getElementById('msg_input');
                    _fsDb.collection('client').doc('node').collection(fcRay)
                    .orderBy("timestamp", "asc").onSnapshot(function(sn){
                        sn.docChanges().forEach(function(ch){
                            let data = ch.doc.data();
                            if(ch.type == 'added'){
                                if(data.maskID == _lstrg.getItem('deamon') && _lstrg.getItem('switchRay') == null){
                                    _lstrg.setItem('switchRay', 1)
                                }
                                else if(data.maskID != _lstrg.getItem('deamon')){
                                    _lstrg.setItem('switchRay', 1)
                                }
                                let msgCard = `
                                    <div class="msg-card ${data.mention.includes(`@${_lstrg.getItem('client')}`) ? 'mention' : 'n'} ${data.reply.replyUserID == _lstrg.getItem('deamon') && data.maskID != _lstrg.getItem('deamon') ? 'res-reply' : 'normal'}" id="msg-card-${data.rayId}"
                                        style="margin: ${data.switchRay==0?'0px':'5px'} 0px ${data.switchRay==0?'2px':'5px'} 0px;padding: ${data.switchRay==0?'3px':'8px'} 8px ${data.switchRay==0?'2px':'4px'} 8px;"
                                    >
                                        <div class="message-btn-cont" style="display: none" id="msg-btn-cont-${data.rayId}">
                                            <span class="btn share" id="reply-btn-${data.rayId}">
                                                <img src="/src/icons/share.svg" /> 
                                            </span>
                                            <span class="btn copy" id="copy-btn-${data.rayId}">
                                                <img src="/src/icons/copy.svg" /> 
                                            </span>
                                            <span class="hr-vertical"></span>
                                            <span class="btn delete" style="display:${data.maskID==_lstrg.getItem('deamon')?'block':'none'}" id="del-btn-${data.rayId}">
                                                <img src="/src/icons/delete.svg" /> 
                                            </span>
                                        </div>
                                        <div class="reply-container" style="display: ${data.reply.isReply == 'true' ? 'flex' : 'none'}" id="reply-redirect-${data.rayId}">
                                            <div class="reply-wrapper">
                                                <span class="replyee-pfp" style="background-image: url(${data.reply.replyUserAvatar || '/src/imgs/avatar.svg'});"></span>
                                                <span class="replyee-uname">@${data.reply.replyUserName}</span>
                                                <span class="replyee-msg-trim" id="reply-msg-${data.reply.replyId}">${document.getElementById(data.reply.replyId) != null ? data.reply.replyMsg : '<i>Message was deleted</i>'}</span>
                                            </div>
                                            <span class="link-node"></span>
                                        </div>
                                        <div class="msg-pf" style="display: ${data.switchRay == 0 ? 'none' : 'flex'}">
                                            <span class="pfp" style="background-image: url(${data.message.authorAvatar || '/src/imgs/avatar.svg'});"></span>
                                            <span class="name" id="pf-name-${data.rayId}">${data.message.author}</span>
                                            <span class="time-stamp time">-&nbsp;&nbsp;${fromNow(data.message.timeStamp)}</span>
                                        </div>
                                        <div class="msg">
                                            <span class="message-content" id="msg-content-${data.rayId}">${utilities.linkify(utilities.getmention(data.message.content))}</span>
                                            <div class="attachment" style="display:${data.attachment.hasAttachment?'flex':'none'}">
                                                <span class="attachment-img" style="background-image: url(${data.attachment.attachment});" id="attachment-${data.rayId}"></span>
                                                <!-- <span class="desc" style="display: ${data.attachment.description != '' ? 'flex' : 'none'}">${data.attachment.description}</span> -->
                                            </div>
                                        </div>  
                                    </div>
                                    `
                                _chat_content_container.insertAdjacentHTML('beforeend', msgCard);
                                
                                _chat_content_container.scrollTop = _chat_content_container.scrollHeight;
                                let _msgCard = document.getElementById(`msg-card-${data.rayId}`),
                                    _replyBtn = document.getElementById(`reply-btn-${data.rayId}`),
                                    _replyHandle = document.getElementById('reply-handle'),
                                    _pfName = document.getElementById(`pf-name-${data.rayId}`),
                                    _replyRedir = document.getElementById(`reply-redirect-${data.rayId}`),
                                    _copyBtn = document.getElementById(`copy-btn-${data.rayId}`),
                                    _deleteBtn = document.getElementById(`del-btn-${data.rayId}`),
                                    _attachmentBtn = document.getElementById(`attachment-${data.rayId}`);

                                (function(){
                                    if(_deleteBtn != null){
                                        _deleteBtn.addEventListener('click', () => {
                                           utilities.alert(
                                                'Are you sure you want to delete this message?',
                                                'alert',
                                                () => {
                                                    _fsDb.collection('client').doc('node').collection(fcRay).doc(data.rayId).delete()
                                                    .then((_cred_) => {}).catch(error => {
                                                        utilities.alert(
                                                            'Opps! Couldn\'t perfom the action, try again later.',
                                                            'info',
                                                            () => {}
                                                        )
                                                    })
                                                }
                                           )
                                        })
                                    }
                                    if(_replyBtn != null){
                                        _replyBtn.addEventListener('click', ()=> {
                                            console.log(`msg-card-${data.rayId}`);
                                            _msgInput.focus();
                                            let replyID = `msg-card-${data.rayId}`, 
                                                isReply = true,
                                                replyMsg = document.getElementById(`msg-content-${data.rayId}`).innerText,
                                                replyUserAvatar = data.message.authorAvatar,
                                                replyUserName = data.message.author,
                                                replyUserProfileBackDrop = data.message.userProfileBackDrop,
                                                replyUserID = data.maskID;
                                            
                                            console.log(replyID,isReply,replyMsg,replyUserAvatar,replyUserName);
                                         
                                            _lstrg.setItem('replyID', replyID);
                                            _lstrg.setItem('isReply', isReply);
                                            _lstrg.setItem('replyMsg', data.attachment.hasAttachment ? 'Attachment' : replyMsg);
                                            _lstrg.setItem('replyUserAvatar', replyUserAvatar);
                                            _lstrg.setItem('replyUserName', replyUserName);
                                            _lstrg.setItem('replyUserProfileBackDrop', replyUserProfileBackDrop);
                                            _lstrg.setItem('replyUserID', replyUserID);
                                            _lstrg.setItem('_metaSwitch', _lstrg.getItem('switchRay'))
                                            
                                            setTimeout(() => {
                                                _lstrg.setItem('switchRay', 1);
                                            }, 100)

                                            if(_replyHandle != null){
                                                _replyHandle.style.display = 'flex';
                                                _replyHandle.innerHTML = `
                                                    <span class="r-text">Replying to <b>${data.message.author}</b></span>
                                                        <span class="r-close-btn" id="r-close-btn">
                                                        <img src="/src/icons/close-fill.svg" />
                                                    </span>`;

                                                if(document.querySelector('.reply') != null){
                                                    document.querySelector('.reply').classList.remove('reply')
                                                }
                                                _msgCard.classList.add('reply');
                                                document.getElementById('r-close-btn')
                                                .addEventListener('click', ()=> {
                                                    _replyHandle.style.display = 'none';
                                                    if(document.querySelector('.reply') != null){
                                                        document.querySelector('.reply').classList.remove('reply')
                                                    }
                                                    (function(){
                                                        _lstrg.removeItem('replyID');
                                                        _lstrg.removeItem('isReply');
                                                        _lstrg.removeItem('replyMsg');
                                                        _lstrg.removeItem('replyUserAvatar');
                                                        _lstrg.removeItem('replyUserName'),
                                                        _lstrg.removeItem('replyUserProfileBackDrop');
                                                        _lstrg.removeItem('replyUserID');
                                                        if(_lstrg.getItem('_metaSwitch') == 1){
                                                            _lstrg.setItem('switchRay', 1);
                                                        }else{
                                                            _lstrg.setItem('switchRay', 0);
                                                        }
                                                    }())
                                                })
                                            }
                                        })
                                    }
                                    if(_msgCard != null){
                                        _msgCard.addEventListener('mouseover', (e) => {
                                            e.preventDefault();
                                            let btnCont = document.getElementById(`msg-btn-cont-${data.rayId}`)
        
                                            if(btnCont.style.display != 'flex'){
                                                btnCont.style.display = 'flex';
                                            }
        
                                            _msgCard.addEventListener('mouseleave', (e) => {
                                                e.preventDefault();
                                                if(btnCont.style.display == 'flex'){
                                                    btnCont.style.display = 'none';
                                                }
                                            })
                                        })
                                    }
                                    if(_pfName != null){
                                        _pfName.addEventListener('click', () => {
                                            _msgInput.value += ` @${_pfName.innerText} `;
                                    })
                                    }
                                    if(_replyRedir != null){
                                        _replyRedir.addEventListener('click', (e) => {
                                            e.preventDefault();
                                            const msgId = data.reply.replyId;

                                            if(document.getElementById(msgId) != null){
                                                _chat_content_container.querySelector(`#${msgId}`).classList.add('msg-redir')
                                                console.log(_chat_content_container.querySelector(`#${msgId}`).classList);
                                                document.getElementById(msgId).scrollIntoView();
                                                setTimeout(() => {
                                                    _chat_content_container.querySelector(`#${msgId}`).classList.remove('msg-redir')
                                                }, 2000)
                                            }
                                        })
                                    }
                                    if(_copyBtn != null){
                                        _copyBtn.addEventListener('click', (e) => {
                                            e.preventDefault();
                                            const cpMsg = document.getElementById(`msg-card-${data.rayId}`);

                                            navigator.clipboard.writeText(cpMsg.querySelector('.message-content').innerText)
                                            .then(()=> {}).catch((err) =>{})
                                        })
                                    }
                                    if(_attachmentBtn != null){
                                        _attachmentBtn.addEventListener('click', (e)=> {
                                            e.preventDefault();
                                            let focusCont = document.getElementById('focus-cont'),
                                            focus = document.getElementById('focus-img'),
                                            focusCap = document.getElementById('caption'),
                                            focusSaveBtn = document.getElementById('save-img-btn');

                                            if(focusCont != null){
                                                focusCont.style.display = 'flex';
                                                focus.style.backgroundImage = `url('${data.attachment.attachment}')`;
                                                focusCap.innerHTML = data.attachment.description || 'Unknown';

                                                focusSaveBtn.addEventListener('click', ()=> {
                                                    console.log(data.attachment.attachment)
                                                })
                                            }
                                        })
                                    }
                                }())
                            }
                            if(ch.type == 'modified'){
                                
                            }
                            if(ch.type == 'removed'){
                                if(document.getElementById(`msg-card-${data.rayId}`) != null){
                                    document.getElementById(`msg-card-${data.rayId}`).remove();
                                }
                            }
                        })
                    })
                   
                },
                onSend: () => {
                    let fcRay = _lstrg.getItem('_fcRay');

                    const _msgInput = document.getElementById('msg_input'),
                    _replyHandle = document.getElementById('reply-handle');

                    document.addEventListener('keyup', (evt) => {
                        evt.preventDefault();
                        if(evt.key == 'Enter' || evt.keyCode === 13){
                            console.log('enter sending message!', _lstrg.getItem('hasAttachment'))
                            if(_msgInput.value != '' || _lstrg.getItem('hasAttachment') != null){
                                let msg = _msgInput.value,
                                    date = new Date(),
                                    _CACHE_ = _lstrg.getItem('cache'),
                                    _cacheData = _CACHE_.split(','),
                                    _daemon = _lstrg.getItem('deamon'),
                                    _desc = _lstrg.getItem('description');

                                const _switchID_ = _lstrg.getItem('switchRay')

                                console.log(_CACHE_, _cacheData[0], _cacheData[1], date, msg)
                                const _rayID_ = utilities.rayId();
                                _fsDb.collection('/client').doc('node').collection(fcRay).doc(_rayID_)
                                .set(
                                    {
                                        id: `${fcRay+_daemon}`,
                                        maskID: `${_daemon}`,
                                        switchRay: _lstrg.getItem('switchRay'),
                                        rayId: `${_rayID_}`,
                                        type: 'default',
                                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                        mention: utilities.hasMention(msg),
                                        attachment: {
                                            hasAttachment: _lstrg.getItem('hasAttachment') || false,
                                            attachment: _lstrg.getItem('attachment') || 'none',
                                            description: _desc || '',
                                        },
                                        reply: {
                                            isReply: _lstrg.getItem('isReply') || false,
                                            replyId: _lstrg.getItem('replyID') || '',
                                            replyMsg: _lstrg.getItem('replyMsg') == 'Attachment' ? 'Attachment' : _lstrg.getItem('replyMsg'),
                                            replyUserName: _lstrg.getItem('replyUserName') || '',
                                            replyUserAvatar: _lstrg.getItem('replyUserAvatar') || '',
                                            replyUserID: _lstrg.getItem('replyUserID') || '',
                                        },
                                        message: {
                                            author: `${_cacheData[0]}`,
                                            authorAvatar: `${_cacheData[1]}`,
                                            authorProfileBackDrop: `${_cacheData[2]}`,
                                            content: `${msg}` || '',
                                            timeStamp: `${date}`,

                                        }
                                    }
                                )
                                .then(()=> {
                                    console.log('done 💌')
                                    if(_lstrg.getItem('switchRay') == null){
                                        _lstrg.setItem('switchRay', 1);
                                    }else{
                                        _lstrg.setItem('switchRay', 0)
                                    }
                                }).catch(err =>{
                                    console.log('opssyy!', err)
                                })
                                _msgInput.value = '';
                                (function(){
                                    if(document.querySelector('.reply') != null){
                                        document.querySelector('.reply').classList.remove('reply')
                                    }
                                    (function(){
                                        _lstrg.removeItem('isReply');
                                        _lstrg.removeItem('replyID');
                                        _lstrg.removeItem('replyMsg');
                                        _lstrg.removeItem('replyUserName');
                                        _lstrg.removeItem('replyUserAvatar');
                                        _lstrg.removeItem('replyUserID');
                                        _lstrg.removeItem('hasAttachment');
                                        _lstrg.removeItem('attachment');
                                        _lstrg.removeItem('desc');

                                        if(document.getElementById('image-picker-cont') != null){
                                            document.getElementById('image-picker-cont').style.display = 'none';
                                            document.getElementById('img-picker').style.display = 'none';
                                            document.getElementById('img-displayer').style.display = 'none';
                                            document.getElementById('spin').style.display = 'flex'
                                        }
                                        if(_replyHandle != null){
                                            _replyHandle.style.display = 'none';
                                            _replyHandle.innerHTML = '';
                                        }
                                    }())
                                }())
                            }
                        }
                    })
                }
            },
            renderMembers: () => {
                console.log('hmm members')

                let ids = [_lstrg.getItem('_fRay'), _usr_];

                // document.getElementById('participant-cont').innerHTML = '';

                for(let a in ids){
                    // console.info('-----',ids[a])
                    _fsDb.collection('/client').doc(ids[a]).collection(ids[a])
                    .doc('udata').get().then((sn) => {
                        // console.log(sn.data());
                        const dval = sn.data();
                        // console.log(dval);

                        let memCard = `
                            <div class="participants-prof-cont"  id="mem-${dval.id}">
                                <span class="participants-pfp" style="background-image: url(${dval.userProfileAvatar || '/src/imgs/avatar.svg'});">
                                </span>
                                <span class="participants-name">${dval.user}<span class="id">#${dval.id}</span></span>
                            </div>
                            `
                        document.getElementById('participant_list_container').insertAdjacentHTML('beforeend', memCard);
                        document.getElementById(`mem-${dval.id}`).addEventListener('click', (e) => {
                            console.log(dval.id);
                            // toggleAvatar(dval, e);
                        })
                    })
                    // document.querySelector('.partici-counter').innerText = `- ${ids.length}`;
                }
            }
        }
        
        const events = {
            onEsc: () => {
                document.onkeydown = function(evt) {
                    evt = evt || window.event;
                    let isEscape = false;
                    if ("key" in evt) {
                        isEscape = (evt.key === "Escape" || evt.key === "Esc");
                    } else {
                        isEscape = (evt.keyCode === 27);
                    }
                    if (isEscape) {
                        // window.history.back();
                    }
                };
            },
            onElementClose: (el) => {
                document.onkeydown = function(evt) {
                    evt = evt || window.event;
                    let isEscape = false;
                    if ("key" in evt) {
                        isEscape = (evt.key === "Escape" || evt.key === "Esc");
                    } else {
                        isEscape = (evt.keyCode === 27);
                    }
                    if (isEscape) {
                        el.style.display = 'none'
                    }
                };
            },
            outClick: (id) => {
                document.addEventListener("mouseup", function(event) {
                    let obj = document.getElementById(id);
                    if (obj != null) {
                        if(!obj.contains(event.target)){
                            obj.style.display = 'none';
                        }
                    }
                });
            }

        }

        getChats.renderChat.renderHeader();
        getChats.renderChat.renderMesg();
        getChats.renderChat.onSend();
        getChats.renderMembers();

        ((function(){
            toggleImgPicker();
            toggleMoji();
            function toggleImgPicker(){
                let imgToggle = document.getElementById('img-toggle'),
                    _pickerCont = document.getElementById('image-picker-cont'),
                    _spinn = document.getElementById('spin'),
                    _imgPicker = document.getElementById('img-picker'),
                    _imgDisplayer = document.getElementById('img-displayer'),
                    _imgInput = document.getElementById('image-file'),
                    _displayer = document.getElementById('displayer'),
                    _pickerErr = document.getElementById('img-picker-error'),
                    _cancelBtn = document.getElementById('cancel-btn');

                imgToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    if(_pickerCont.style.display !== 'flex'){
                        _pickerCont.style.display = 'flex';
                        setTimeout(() => {
                            _spinn.style.display = 'none';
                            if(_imgDisplayer.style.display != 'flex'){
                                _imgPicker.style.display = 'flex';
                            }
                        }, 300)
                        if(_pickerCont.style.display !== 'none'){
                            if(_imgDisplayer.style.display != 'flex'){
                                events.onElementClose(() => {
                                    if(_imgPicker.style.display != 'none'){
                                        _imgPicker.style.display = 'none';
                                        _pickerCont.style.display = 'none';
                                        _spinn.style.display = 'flex';
                                    }else{
                                        return;
                                    }
                                })
                                events.outClick(_pickerCont.id, () => {
                                    if(_imgPicker.style.display != 'none'){
                                        _imgPicker.style.display = 'none';
                                        _pickerCont.style.display = 'none';
                                        _spinn.style.display = 'flex';
                                    }else{
                                        return;
                                    }
                                })
                            }else{
                                return;
                            }
                        }
                    }
                })

                _cancelBtn.addEventListener('click', (e) =>{
                    e.preventDefault();

                    if(_imgDisplayer.style.display != 'none'){
                        _imgDisplayer.style.display = 'none';
                        _imgPicker.style.display = 'flex';
                        _pickerErr.style.display = 'none';
                    }
                    _lstrg.removeItem('attachment');
                    _lstrg.removeItem('hasAttachment');
                    _lstrg.removeItem('desc');
                })

                let _uid = _lstrg.getItem('deamon');

                _imgInput.addEventListener('change', () => {
                    _gImgData();
                })

                function _gImgData(){
                    _pickerErr.style.display = 'none';
                    _imgPicker.style.display = 'none';
                    _imgDisplayer.style.display = 'flex';
                    
                    const files = _imgInput.files[0];

                    let _progLayer = document.getElementById('_prog-layer'),
                        _progBar = document.getElementById('_prog-bar'),
                        _fileDesc = document.getElementById('file-desc');

                    console.log("FileName", files)
                    const uploadTask = _fstrg.ref(`client/${_uid}`).child(files.name).put(files);

                    uploadTask.on('state_changed', (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            
                            let _height_ = (Math.floor(progress) * 70) / 100;
                            let _cheight = Math.floor(70 - (Math.floor(progress) * 70) / 100)

                            _progLayer.style.height = `${_cheight}px`;
                            _progBar.style.width = `${Math.floor(progress)}%`;
                            if(Math.floor(progress) == 100){
                                _progBar.classList.add('loading');
                            }
                        },
                        (error) => {
                            if(_imgDisplayer.style == 'flex'){
                                _imgDisplayer.style.display = 'none';
                                _pickerErr.style.display = 'flex';
                            }
                            worker._sn._Err('Couldn\'t upload the image, please try again later!', _errH);
                            console.log("error:-", error)
                        },
                        () => {
                            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                 document.querySelector('.prog-bg').style.display = 'none';
                                 _progBar.classList.remove('loading')
                                console.log('File available at', downloadURL);
                                let attachment = downloadURL.toString(),
                                    hasAttachment = true,
                                    desc =  _fileDesc.value;

                                _lstrg.setItem('hasAttachment', hasAttachment);
                                _lstrg.setItem('attachment', attachment);
                                _lstrg.setItem('description', files.name);
                            });
                        }
                    )
                    if(files){
                        const _fReader = new FileReader();
                        _fReader.readAsDataURL(files);
                        _fileDesc.value = files.name
                        _fReader.addEventListener('load', function(){
                            _displayer.style.backgroundImage = `url('${this.result}')`;
                            _displayer.style.backgroundSize = 'cover';
                            _displayer.style.backgroundPosition = 'center';
                        })
                        // _fileDesc.innerText = utilities.trimFileName(files.name)
                        
                        _fileDesc.addEventListener('input', () => {
                            _lstrg.setItem('desc', _fileDesc.value);
                            console.log(_fileDesc.value)
                        }) 
                    }
                }
            }
            function toggleMoji(){
                let mojiCont  = document.querySelector('#san-moji-snippet'),
                chtInput = document.querySelector('#msg-input');

                document.querySelector('#moji-btn')
                .addEventListener('click', ()=> {
                    let _width = document.documentElement.clientWidth,
                        _height = document.documentElement.clientHeight;
                    
                    mojiCont.style.display = 'flex';
                    
                    let mojiPicker = document.querySelector('.emoji-picker');
                    let pos = mojiPicker.getBoundingClientRect();
                    // mojiCont.style.top = `${(_height - 400)}px`
                    mojiCont.style.top = `${_height - pos.height - 68}px`;
                    mojiCont.style.left = `${_width - pos.width - 38}px`;

                    events.onElementClose(mojiCont);
                    events.outClick(mojiCont.id);

                    if(pos.height + pos.y >= _height){
                        mojiCont.style.top = `${_height - pos.height - 68}px`;
                        console.log('greater than height with', _height+pos.height);
                    }
                })
                $("#san-moji-snippet").disMojiPicker();
                twemoji.parse(document.body);
                $('#san-moji-snippet').picker(
                    emoji => document.getElementById('msg_input').value += `${emoji} `
                )
            }
            $('.back-btn').on('click', () =>{
                console.log('%c back back', utilities.consoleColor)
            })
        }()))
        return;
    }
}

export default chat;