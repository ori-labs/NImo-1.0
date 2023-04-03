'use-strict';
import config from "../components/lib/sanMoji/js/config.js";
import utilities from "../components/utilities/utilities.js";
import Router from "../components/services/router/router.js";


(function(){
    location.hash = '#app';
    console.log('%cSESSION: Home', 'color: #d71b43');
    firebase.initializeApp({
        apiKey: config._napi,
        authDomain: config._ndomain,
        projectId: config._pid,
        appId: config._aid,
        storageBucket: config._stBck
    })
    
    let  lsDB = localStorage;

    let auth = firebase.auth(),
        fsDB = firebase.firestore();

    let root = document.getElementById('root');

    const router = new Router({
        mode: 'hash',
        root: '/'
    });

    function init(){
        (function(uid){
            let id0,
                user0;

            let vault_btn = document.getElementById('vault-btn'),
                notification_btn = document.getElementById('notification-btn');

            fsDB.collection('/client').doc('meta').collection(uid).doc('meta_data').get()
            .then((sn) => {
                $('#spinnerx').removeClass('load');
                if($('#spinnerx').length > 0){
                    $('#spinnerx').removeClass('show');
                }
                const data = sn.data();
                id0 = data.id;
                user0 = data.user;
                document.querySelector('.h-usr-name').innerHTML = `${data.user}`;
                document.querySelector('#uid').innerHTML = `@${data.id}`;
                document.querySelector('.h-prof-img').style.backgroundImage = `url(${data.userProfileAvatar == 'default' ? '../src/imgs/avatar.png' : data.userProfileAvatar})`;
                document.querySelector('.h-prof-img').style.backgroundColor = `${data.userProfileBackDrop}`;

                lsDB.setItem('cache', [data.user, data.userProfileAvatar || null, data.userProfileBackDrop])
                lsDB.setItem('client', data.user);
            }).catch((err) => {
                console.log('something went wrong', err);
                location.reload();
            });
            document.querySelector('[data-user-container]').addEventListener('click', () => {
                console.log(id0);
                navigator.clipboard.writeText(`${user0}@${id0}`)
                .then(() => {
                    utilities.popup('User id copied successfully!', root);
                })
                .catch((err) => {
                    console.error('%cNode error', 'color: #1299dc');
                });
            });

            vault_btn.addEventListener('click', ()=> {
                location.hash = '#?vault'
            });
            notification_btn.addEventListener('click', ()=> {
                location.hash = '#?notifications';
            });

            (function(){
                listen_to_request();
                listen_to_notification();

                function listen_to_request(){
                    vault_btn.innerHTML = `<span>
                                            <img class="frnd" src="../src/icons/friends.svg" alt="">
                                        </span>`
                    fsDB.collection('client').doc('meta').collection(uid).doc('requests').collection('incoming').onSnapshot(function(sn){
                        sn.docChanges().forEach(function(ch){
                            lsDB.setItem('vault_inbox_count', sn.size);
                            let bagde_card = `
                                <span class="bagde vault-bagde scale-up-center" id="vault-bagde">${sn.size}</span>
                            `;
                            vault_btn.insertAdjacentHTML('beforeend', bagde_card);

                            if(sn.size <= 0){
                                vault_btn.innerHTML = `<span>
                                    <img class="frnd" src="../src/icons/friends.svg" alt="">
                                </span>`
                            }
                        })
                    })
                };
                function listen_to_notification(){
                    notification_btn.innerHTML = `<span>
                                            <img class="frnd" src="../src/icons/notification.svg" alt="">
                                        </span>`
                    fsDB.collection('client').doc('meta').collection(uid).doc('notifications').collection('inboxes').onSnapshot(function(sn){
                        sn.docChanges().forEach(function(ch){
                            lsDB.setItem('inbox size', sn.size);
                            let bagde_card = `
                                <span class="bagde vault-bagde scale-up-center" id="vault-bagde">${sn.size}</span>
                            `;
                            notification_btn.insertAdjacentHTML('beforeend', bagde_card);

                            if(sn.size <= 0){
                                notification_btn.innerHTML = `<span>
                                    <img class="frnd" src="../src/icons/friends.svg" alt="">
                                </span>`
                            }
                        });
                    })
                };
            }());
        }(lsDB.getItem('id')));
        (function(uid){
            let get_friends = async () => {
                let dfCard = `
                    <div class="NOF">
                        <img src="/src/assets/nof.svg" />
                        <span class="nof-title">It's quiet for now!</span>
                        <span class="hr"></span>
                        <span class="nof-sub">Add friends to start chatting!</span>
                        <button class="nof-btn" id="add-friend"> 
                            <img src="../src/icons/add-freind.svg" />
                            <span>Add friend </span>
                        </button>
                    </div>`;
                let friend_list_cont = document.getElementById('f_list'),
                    spmc = 0;
                firebase.firestore().collection('/client').doc(uid).collection(uid).doc('chats').collection('node')
                .get().then((sn) => {
                    if(sn.docs.length > 0) {
                        let _dId = 0;
                        sn.forEach((s) => {
                            const dataVal = s.data();
                            let _CID = dataVal.cId,
                                _FID = dataVal.fId;
                            renderFnd(_FID, _CID);
                        })
                    }else{
                        friend_list_cont.innerHTML = dfCard;
                        let add_friend_btn = document.getElementById('add-friend');

                        add_friend_btn.addEventListener('click', function(e){
                            e.preventDefault();
                            console.log('adding friend thingi');
                            location.hash = '#?addfriend';
                        })
                    }
                })

                function  renderFnd(fID, cID){
                    fListCont.innerHTML = '';
                    fsDB.collection('/client').doc(fID).collection(fID)
                    .doc('udata').get().then((sn) => {
                        const _dval = sn.data();
                        let fCard = `
                            <div class="friend-card" id="fid=${fID}">
                                <div class="friend-pfp-cont">
                                    <span class="f-pfp" style="background-image: url(${_dval.userProfileAvatar || '/src/imgs/avatar.svg'});background-color: ${_dval.userProfileBackDrop};"></span>
                                    <!-- <span class="bagde">9+</span> -->
                                </div>
                                <span class="f-uname">${_dval.user}</span>
                            </div>
                        `;
                        fListCont.insertAdjacentHTML('beforeend', fCard);
                        const f_btn = document.getElementById(`fid=${fID}`);
    
                        f_btn.addEventListener('click', (e)=> {
                            e.preventDefault();
                            console.log(fID, cID);
                            // window.location.hash = '/nimo-app#chats'
                            // lsDB.setItem('_fRay', _fID);
                            // lsDB.setItem('_fcRay', cID);
                        })
                        
                    })
                }
            };
            let get_rooms = async () => {
                console.log(utilities.genID())
            };

            get_friends();
            get_rooms();
        }(lsDB.getItem('id')));
    }
    (function(){
        initLag();
        auth.onAuthStateChanged( async __usr__ => {
            if(__usr__){
                const meta_data = await getMeta(__usr__.uid);

                lsDB.setItem('id', meta_data[1]);

                const state = meta_data[0];

                if(state != null){
                    if(state === 'setup'){
                        location.href = `/pages/setup.html?uid=${__usr__.uid}`;
                        console.log('rewinding setup ..')
                    }else if(state === 'cancel'){
                        location.href = '/pages/login.html';
                    }else if(state === 'user'){
                        console.log('%cUSER STATE : USER', 'color: #23e34d');
                        init();  
                    }
                }else{
                    console.log('state : '+state);
                    console.log('user not registered yet');
                }
            }else{
                console.log('not registered yet as a user');
                location.href = '/pages/login.html';
            }
        })
        async function getMeta(_usr_) {
            let _state_ = [];

            await fsDB
                .collection("client")
                .doc("meta_index")
                .collection(_usr_)
                .doc("meta_index")
                .get()
                .then(async (_doc_) => {
                    if (_doc_.exists) {
                        const id = _doc_.data().id;
                        await fsDB
                            .collection("client")
                            .doc("meta")
                            .collection(id)
                            .doc("meta")
                            .get()
                            .then((meta) => {
                                if (meta.exists) {
                                    _state_.push(meta.data().state);
                                    _state_.push(meta.data().id);
                                    _state_.push(meta.data().default_color);
                                } else {
                                    _state_ = "null";
                                    console.log("meta was not found");
                                    hide_preloader();
                                }
                                return _state_;
                            });
                    } else {
                        _state_ = "null";
                        console.log("doc doesnt exist, sending you to login page");
                        hide_preloader();
                    }
                    return _state_;
                })
                .catch((err) => {
                    console.log(
                        "%cSomething went wrong!, retrying in 5 sec",
                        utilities.consoleColor
                    );
                    hide_preloader();
                    $("#spinnerx").addClass("show");
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                });
            return _state_;
        }
    }());
    (function(){
        router
        .add('', async ()=>{
            let current_hash = location.hash;
            console.log(`%c${current_hash}`, 'color: #df3021');

            let main_hash = current_hash.split('?')[1];
            if(main_hash != 'addfriend'){
                let adf_container = document.getElementById('addfriend-cont');
                if(adf_container != null){
                    adf_container.remove();
                }
            }else{
                render_add_friend();
            };
            if(main_hash != 'vault'){
                let vault_container = document.getElementById('vault');
                if(vault_container != null){
                    vault_container.remove();
                }
                console.log('not vault')
            }else{
                render_vault();
            };
            if(main_hash != 'notifications'){
                let notification_container = document.getElementById('notifications');
            }else{
                render_notifications();
            }
        })
    }());

    const evenListener = {
        listen: {
            esc: (el, el2) => {
                if(el != null){
                    log('can go back');
                    document.onkeydown = function(evt) {
                        evt = evt || window.event;
                        let isEscape = false;
                        if ("key" in evt) {
                            isEscape = (evt.key === "Escape" || evt.key === "Esc");
                        } else {
                            isEscape = (evt.keyCode === 27);
                        }
                        if (isEscape) {
                            el2.classList.add('scale-out-center');
                            setTimeout(() => {
                                el2.classList.remove('scale-out-center');
                                history.back();
                            }, 100);
                        }
                    };
                }else{
                    return;
                }
                
            },
            outClick: (id) => {
                document.addEventListener("mouseup", function(event) {
                    let obj = document.getElementById(id);
                    if(obj != null){
                        if (!obj.contains(event.target)) {
                            obj.classList.add('scale-out-center');
                            setTimeout(() => {
                                obj.classList.remove('scale-out-center');
                                history.back();
                            }, 100);
                        }
                    }else{
                        return;
                    }
                });
            }
        },
    };
    const msgbox = {
        alert: (msg, iconEl, msgEl, parent, type) =>{
            msgEl.innerHTML = msg;
            parent.style.display = 'flex';
            if(type == 'error'){
                parent.classList.add('msg-box-error');
                parent.classList.remove('msg-box-success');
                iconEl.src = '../src/icons/info-white.svg';
            }else if(type == 'success'){
                parent.classList.add('msg-box-success');
                parent.classList.remove('msg-box-error');
                iconEl.src = '../src/icons/success-white.svg';
            }

            setTimeout(() => {
                parent.style.display = 'none';
            }, 3000)
        }
    };

    function render_add_friend(){
        let view = `
            <div class="addfriend-cont" id="addfriend-cont">
                <div class="wrapper scale-up-center" id="container-wrappper">
                    <div class="header">
                        <span class="title">
                            <img src="/src/icons/add-freind.svg" alt="">
                            <span>Add friend</span>    
                        </span>
                        <span class="close-btn" id="adf-close-btn">
                            <img src="/src/icons/close-white.svg" alt="">
                        </span>
                    </div>
                    <div class="contents">
                        <span class="label">Add friends easily by entering their user id. <br> eg. sadie@123456789.</span>
                        <div class="input-cont">
                            <input type="text" name="id" id="input-fr" placeholder="sadie@123456789">
                            <span class="add-btn" id="send_btn">Send</span>
                        </div>
                    </div>
                    <div class="msg-box" id="msg-box">
                        <img src="" alt="" id="msg-box-icon">
                        <span class="msg" id="adf-msg"></span>
                    </div>
                </div>
            </div>`;
        root.insertAdjacentHTML('beforeend', view);

        let container = document.getElementById('addfriend-cont'),
            container_wrapper = document.getElementById('container-wrappper'),
            close_btn = document.getElementById('adf-close-btn'),
            send_btn = document.getElementById('send_btn'),
            input = document.getElementById('input-fr');
        
        let msgbox_parent = document.getElementById('msg-box'),
            msgbox_msgEl = document.getElementById('adf-msg'),
            msgbox_icoonEl = document.getElementById('msg-box-icon');

        let value;
        
        input.oninput = function(e){
            e.preventDefault();
            value = this.value;
            log(value);
        };
        input.addEventListener('keyup', (evt) => {
            if (evt.key === 'Enter' || evt.keyCode === 13) {
                validate_request();
            }
        });
        send_btn.addEventListener('click', () => {
            validate_request();
        });
        close_btn.addEventListener('click', function(e){
            e.preventDefault();
            container_wrapper.classList.add('scale-out-center');
            setTimeout(() => {
                container_wrapper.classList.remove('scale-out-center');
                history.back();
            }, 100);
        });
        evenListener.listen.esc(container, container_wrapper);
        evenListener.listen.outClick('container-wrappper');
        
        function validate_request(){
            const regex = /^[a-zA-Z]+@[0-9]{9}$/;

            const _prld = `
                <span class="preload">
                    <img src="../src/assets/spinner-2.svg" alt="">
                </span>`;

            if(input.value != ''){
                log(input.value);
             
                (function(uid){
                    if(!regex.test(value)){
                        console.log('invalid username and ID');
                        msgbox.alert(
                            'Invalid or poorly formatted Username and ID!',
                            msgbox_icoonEl,
                            msgbox_msgEl,
                            msgbox_parent,
                            'error'
                        )
                    }else{
                        let user_id = input.value.split('@')[1];
                        log(user_id);
                        if(user_id == uid){
                            msgbox.alert(
                                'You cannot send yourself friend request!',
                                msgbox_icoonEl,
                                msgbox_msgEl,
                                msgbox_parent,
                                'error'
                            )
                        }else{
                            send_btn.innerHTML = _prld;
                            send_btn.disabled = true;
                            input.disabled = true;

                            fsDB.collection("client")
                            .doc("meta")
                            .collection(user_id)
                            .limit(1)
                            .get()
                            .then((user) => {
                                console.log(user.size);
                                if(user.size <= 0){
                                    msgbox.alert(
                                        `Opps! No user with '${input.value}' was found!`,
                                        msgbox_icoonEl,
                                        msgbox_msgEl,
                                        msgbox_parent,
                                        'error'
                                    );
                                    reset();
                                }else{
                                    let date = new Date();
                                    fsDB.collection('client').doc('meta').collection(user_id).doc('requests')
                                    .collection('incoming').doc(uid)
                                    .set({
                                        id: uid,
                                        date: date
                                    }).then(() => {
                                        fsDB.collection('client').doc('meta').collection(uid).doc('requests')
                                        .collection('outgoing').doc(user_id)
                                        .set({
                                            id: user_id,
                                            date: date
                                        }).then(() => {
                                            log('request sent to'+user_id);
                                            msgbox.alert(
                                                `Request was sent successfully!`,
                                                msgbox_icoonEl,
                                                msgbox_msgEl,
                                                msgbox_parent,
                                                'success'
                                            );
                                            reset();
                                        }).catch(error => {
                                            msgbox.alert(
                                                `Opps! Something went seriously wrong, try again later!`,
                                                msgbox_icoonEl,
                                                msgbox_msgEl,
                                                msgbox_parent,
                                                'error'
                                            );
                                            reset();
                                        })
                                    }).catch(error => {
                                        msgbox.alert(
                                            `Opps! Something went seriously wrong, try again later!`,
                                            msgbox_icoonEl,
                                            msgbox_msgEl,
                                            msgbox_parent,
                                            'error'
                                        );
                                        reset();
                                    })
                                }
                            }).catch(error => {
                                msgbox.alert(
                                    `Opps! Something went seriously wrong, try again later!`,
                                    msgbox_icoonEl,
                                    msgbox_msgEl,
                                    msgbox_parent,
                                    'error'
                                );
                                reset();
                            })
                            console.log('searching for valid match');
                        }
                    };
                }(lsDB.getItem('id')));
            }else{
                input.focus();
                msgbox.alert(
                    'Username and ID must be provided!',
                    msgbox_icoonEl,
                    msgbox_msgEl,
                    msgbox_parent,
                    'error'
                )
            }
        }
        function reset(){
            send_btn.disabled = false;
            send_btn.innerHTML = 'Send';
            input.value = '';
            input.disabled = false;
        }
    };
    function render_vault(){
        (function(uid){
            let view = `
                <div class="vault" id="vault">
                    <div class="wrapper scale-up-center" id="vault-container">
                        <div class="content-wrapper">
                            <div class="header">
                                <div class="btn-cont">
                                    <div class="btn-wrapper active" id="vault-friends-btn">
                                        <span class="btn">Friends</span>
                                    </div>
                                    <div class="btn-wrapper" id="vault-requests-btn">
                                        <span class="btn">Requests</span>
                                        <span class="bagde" style="display: none" id="request-badge"></span>
                                    </div>
                                </div>
                                <div class="close-btn-cont" id="vault-close-btn">
                                    <img src="/src/icons/close-white.svg" alt="">
                                </div>
                            </div>
                            <div class="container-wrapper friends" id="vault-friends-cont">
                            </div>
                            <div class="container-wrapper requests hide" id="vault-requests-cont">
                                <div class="request-cat-cont">
                                    <div class="cat-wrapper">
                                        <div class="cat-item incoming-req active" id="incoming-req-btn">
                                            <span class="cat">Incoming</span>
                                            <span class="bagde" style="display: none" id="request-cat-badge"></span>
                                        </div>
                                        <div class="cat-item pending" id="pending-req-btn">
                                            <span class="cat">Pending</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="request-item-cont incoming-requests" id="incoming-req-cont">
                                </div>
                                <div class="request-item-cont pending-requests hide" id="pending-req-cont">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            root.insertAdjacentHTML('beforeend', view);
            
            let vault_container = document.getElementById('vault'),
                vault_wrapper = document.getElementById('vault-container'),
                vault_freinds_btn = document.getElementById('vault-friends-btn'),
                vault_requests_btn = document.getElementById('vault-requests-btn'),
                vault_friends_cont = document.getElementById('vault-friends-cont'),
                vault_requests_cont = document.getElementById('vault-requests-cont'),
                vault_close_btn = document.getElementById('vault-close-btn');
            
            let vault_incoming_req_btn = document.getElementById('incoming-req-btn'),
                vault_pending_req_btn = document.getElementById('pending-req-btn'),
                vault_incoming_req_cont = document.getElementById('incoming-req-cont'),
                vault_pending_req_cont = document.getElementById('pending-req-cont');

            let request_badge = document.getElementById('request-badge'),
                request_cat_bagde = document.getElementById('request-cat-badge');
            
            vault_freinds_btn.addEventListener('click', () => {
                if(!vault_freinds_btn.classList.contains('active')){
                    vault_freinds_btn.classList.add('active');
                    vault_requests_btn.classList.remove('active');

                    switch_tab(vault_requests_cont, vault_friends_cont);
                    render_friends_list();
                }
            });
            vault_requests_btn.addEventListener('click', () => {
                if(!vault_requests_btn.classList.contains('active')){
                    vault_requests_btn.classList.add('active');
                    vault_freinds_btn.classList.remove('active');
                    
                    switch_tab(vault_friends_cont, vault_requests_cont);
                }
            });
            vault_close_btn.addEventListener('click', () => {
                vault_wrapper.classList.add('scale-out-center');
                setTimeout(() => {
                    history.back();
                    vault_wrapper.classList.remove('scale-out-center');
                }, 100);
            });

            vault_incoming_req_btn.addEventListener('click', () => {
                if(!vault_incoming_req_btn.classList.contains('active')){
                    vault_incoming_req_btn.classList.add('active');
                    vault_pending_req_btn.classList.remove('active');

                    switch_tab(vault_pending_req_cont, vault_incoming_req_cont);
                }
            });
            vault_pending_req_btn.addEventListener('click', () => {
                if(!vault_pending_req_btn.classList.contains('active')){
                    vault_pending_req_btn.classList.add('active');
                    vault_incoming_req_btn.classList.remove('active');

                    switch_tab(vault_incoming_req_cont, vault_pending_req_cont);
                }
            });

            (function(){
                vault_incoming_req_cont.innerHTML =  `<div class="empty-friend-list">
                    <div class="empty-list-wrapper">
                            <span class="icon-cont">
                            <img src="../src/assets/empty.svg" />
                            </span>
                            <span class="label">No incoming request.</span>
                        </div>
                    </div>`;
                fsDB.collection('client').doc('meta').collection(uid).doc('requests').collection('incoming')
                .onSnapshot(function(sn){
                    sn.docChanges().forEach(function(req){
                        log(req.doc.data());
                        let req_id = req.doc.data().id,
                            req_date = req.doc.data().date.toDate();
                        
                        if(sn.size <= 0){
                            vault_incoming_req_cont.innerHTML =  `<div class="empty-friend-list">
                                <div class="empty-list-wrapper">
                                        <span class="icon-cont">
                                        <img src="../src/assets/empty.svg" />
                                        </span>
                                        <span class="label">No incoming request.</span>
                                    </div>
                                </div>`;
                        }else{
                            vault_incoming_req_cont.innerHTML = '';
                            fsDB.collection('client').doc('meta').collection(req_id).doc('meta_data')
                            .get().then(data => {
                                let user_data = data.data();
                                let card = `
                                    <div class="friend-card incoming" id="incoming-card-${req_id}">
                                        <div class="identifier-cont">
                                            <span class="identifier">
                                                <img src="src/icons/incoming.svg" alt="">
                                                <span class="label">Incoming request</span>
                                            </span>
                                            <span class="new-badge"></span>
                                        </div>
                                        <div class="card-wrapper">
                                            <div class="avatar-comp-cont">
                                                <div class="pfp-cont">
                                                    <div class="pfp" style="background-image: url(${user_data.userProfileAvatar == 'default' ? '../src/imgs/default-avatar.pbg' : user_data.userProfileAvatar});">
                                                    </div>
                                                </div>
                                                <div class="user-info-cont">
                                                    <span class="username">${user_data.user}</span>
                                                    <span class="id">${utilities.formatDate(req_date)}</span>
                                                </div>
                                            </div>
                                            <div class="btn-comp-cont">
                                                <span class="btn-item btn btn-danger-normal" id="req-decline-btn-${req_id}">
                                                    Decline
                                                </span>
                                                <span class="hr"></span>
                                                <span class="btn-item btn btn-primary" id="req-accept-btn-${req_id}">
                                                    Accept
                                                </span>
                                                
                                            </div>
                                        </div>
                                    </div>`;
    
                                vault_incoming_req_cont.insertAdjacentHTML('beforeend', card);
    
                                let req_accept_btn = document.getElementById(`req-accept-btn-${req_id}`),
                                    req_decline_btn = document.getElementById(`req-decline-btn-${req_id}`);
    
                                let incoming_card = document.getElementById(`incoming-card-${req_id}`);
    
                                try {
                                    req_accept_btn.addEventListener('click', () => {
                                        req_accept_btn.innerHTML = `<span class="preload">
                                                <img src="../src/assets/spinner-2.svg" alt="">
                                            </span>`;
                                        req_accept_btn.disabled = true;
                                        req_decline_btn.disabled = true;
    
                                        let link_id = utilities.rayId(),
                                            remote_id = utilities.rayId(),
                                            date = new Date();
                                        log(remote_id);
                                        
                                        fsDB.collection('client').doc('meta').collection(uid).doc('links').collection('remotes')
                                        .doc(remote_id).set({
                                            link_id: link_id,
                                            remote_id: remote_id,
                                            friend_id: req_id,
                                            date: date
                                        }).then(() => {
                                            fsDB.collection('client').doc('meta').collection(req_id).doc('links').collection('remotes')
                                            .doc(remote_id).set({
                                                link_id: link_id,
                                                remote_id: remote_id,
                                                friend_id: uid,
                                                date: date
                                            }).then(() => {
                                                //send them notification of an accepted f-request --> //TODO
                                                fsDB.collection('client').doc('meta').collection(uid).doc('requests').collection('incoming')
                                                .doc(req_id).delete().then(() => {
                                                    log('cache cleared from personal inbox!');
                                                    fsDB.collection('client').doc('meta').collection(req_id).doc('requests').collection('outgoing')
                                                    .doc(uid).delete().then(() => {
                                                        if(incoming_card != null){
                                                            incoming_card.remove();
                                                        }
                                                        log('cache deleted from requester')
                                                    }).catch(err => {
                                                        log(err);
                                                    })
                                                }).catch(err => {
                                                    log(err);
                                                })
                                                log('friend added successful')
                                            }).catch(error => {
                                                log(error);
                                            });
                                        }).catch(error => {
                                            log(error);
                                        });
                                    });
                                    req_decline_btn.addEventListener('click', () => {
                                        log(req_id);
                                        utilities.alert('Are you sure you want to decline this request?', 'alert', action);
        
                                        function action(){
                                            log('okii declining request');
                                            fsDB.collection('client').doc('meta').collection(uid).doc('requests').collection('incoming')
                                            .doc(req_id).delete().then(() =>{
                                                fsDB.collection('client').doc('meta').collection(req_id).doc('requests').collection('outgoing')
                                                .doc(uid).delete().then(() => {
                                                    log('declined friend requests');
                                                })
                                            })
                                        }
                                    })
                                } catch (error) {
                                    log('nothing to catch ignored!')
                                }
                            });
                        }

                        request_badge.innerText = `${sn.size}`;
                        request_cat_bagde.innerText = `${sn.size}`;
                        request_badge.style.display = sn.size <= 0 ? 'none' : 'flex';
                        request_cat_bagde.style.display = sn.size <= 0 ? 'none' : 'flex';
                    });
                });
            }());
            render_outgoing_list();

            function render_outgoing_list(){
                fsDB.collection('client').doc('meta').collection(uid)
                .doc('requests').collection('outgoing')
                .get().then((sn) => {
                    if(sn.size <= 0){
                        vault_pending_req_cont.innerHTML = `<div class="empty-friend-list">
                        <div class="empty-list-wrapper">
                                <span class="icon-cont">
                                    <img src="../src/assets/empty.svg" />
                                </span>
                                <span class="label">No pending request.</span>
                            </div>
                        </div>`;
                    };
                    sn.forEach(req => {
                        let req_id = req.data().id,
                            req_date = req.data().date.toDate();
                        
                        console.log(utilities.formatDate(req_date));

                        fsDB.collection('client').doc('meta').collection(req_id).doc('meta_data')
                        .get().then(data => {
                            let user_data = data.data();
                            let card = `
                                <div class="friend-card outgoing" id="outgoing-card-${req_id}">
                                    <div class="identifier-cont">
                                        <span class="identifier">
                                            <img src="src/icons/outgoing.svg" alt="">
                                            <span class="label">Outgoing request</span>
                                        </span>
                                    </div>
                                    <div class="card-wrapper">
                                        <div class="avatar-comp-cont">
                                            <div class="pfp-cont">
                                                <div class="pfp" style="background-image: url(${user_data.userProfileAvatar == 'default' ? '../src/imgs/default-avatar.pbg' : user_data.userProfileAvatar});">
                                                </div>
                                            </div>
                                            <div class="user-info-cont">
                                                <span class="username">${user_data.user}</span>
                                                <span class="id">${utilities.formatDate(req_date)}</span>
                                            </div>
                                        </div>
                                        <div class="btn-comp-cont">
                                            <span class="btn-item btn btn-danger-normal" id="outgoing-cancel-btn-${req_id}">
                                                Cancel
                                            </span>
                                        </div>
                                    </div>
                                </div>`;

                            vault_pending_req_cont.insertAdjacentHTML('beforeend', card);

                            let outgoing_cancel_btn = document.getElementById(`outgoing-cancel-btn-${req_id}`),
                                outgoing_card = document.getElementById(`outgoing-card-${req_id}`);

                            outgoing_cancel_btn.addEventListener('click', () => {
                                log(req_id);
                                utilities.alert('Do you want to cancel this request?', 'alert', action);

                                function action(){ //delete my outgoing request --> go to friends incoming and check for my request id -> delete;
                                    fsDB.collection('client').doc('meta').collection(req_id).doc('requests').collection('incoming')
                                    .doc(uid).delete().then(() => {
                                         fsDB.collection('client').doc('meta').collection(uid).doc('requests').collection('outgoing')
                                        .doc(req_id).delete().then(() => {
                                            render_outgoing_list();
                                        }).catch(err => {
                                            log(err);
                                        })
                                    }).catch(err => {
                                        log(err)
                                    });
                                }
                            })
                        }).catch(error => {
                            log(error);
                        });
                    });
                }).catch(error => {
                    log(error);
                });
            }
            (function(){
                render_friends_list();
            }());

            function render_friends_list(){
                log('getting friend lists');
                let empty_friend_list_holder = `
                    <div class="empty-friend-list">
                        <div class="empty-list-wrapper">
                            <span class="icon-cont">
                                <img src="../src/assets/no-friends.svg" />
                            </span>
                            <span class="label">Looks like there's no one in your <br> friends list yet!</span>
                            <span class="hr"></span>
                            <span class="nof-sub">Quickly add your friends to connect and start chatting!</span>
                            <button class="nof-btn" id="vault-add-friend-btn"> 
                                <img src="../src/icons/add-freind.svg" />
                                <span>Add friend </span>
                            </button>
                        </div>
                    </div>`;

                fsDB.collection('client').doc('meta').collection(uid).doc('links').collection('remotes')
                .get().then((link_data) => {
                    vault_friends_cont.innerHTML = '';

                    link_data.forEach(data => {
                        let friend_id = data.data().friend_id,
                            remote_id = data.data().remote_id;

                        fsDB.collection('client').doc('meta').collection(friend_id).doc('meta_data')
                        .get().then((friend_data) => {
                            let fdata = friend_data.data();
                            let card = `
                                <div class="friend-card">
                                    <div class="card-wrapper">
                                        <div class="avatar-comp-cont">
                                            <div class="pfp-cont">
                                                <div class="pfp" style="background-image: url(${fdata.userProfileAvatar == 'default' ? '../src/imgs/default-avatar.png' : fdata.userProfileAvatar});">
                                                </div>
                                            </div>
                                            <div class="user-info-cont">
                                                <span class="username">${fdata.user}</span>
                                                <span class="id">@${fdata.id}</span>
                                            </div>
                                        </div>
                                        <div class="btn-comp-cont">
                                            <span class="btn-item" id="friend-chat-btn-${remote_id}">
                                                <img src="/src/icons/msg.svg" alt="">
                                            </span>
                                            <span class="hr"></span>
                                            <span class="btn-item" id="friend-remove-btn-${friend_id}">
                                                <img src="/src/icons/remove-friend.svg" alt="">
                                            </span>
                                        </div>
                                    </div>
                                </div>`;
                            vault_friends_cont.insertAdjacentHTML('beforeend', card);

                            let vault_friend_chat_btn = document.getElementById(`friend-chat-btn-${remote_id}`),
                                vault_friend_remove_btn = document.getElementById(`friend-remove-btn-${friend_id}`);
                            
                            vault_friend_chat_btn.addEventListener('click', () => {
                                setTimeout(() => {
                                    location.href = `../pages/chat.html?rid=${remote_id}`;
                                }, 100)
                            });
                            vault_friend_remove_btn.addEventListener('click', ()=> {
                                utilities.alert(`Are you sure you want to remove <b>${fdata.user}</b> from your friend list?`,alert, action);

                                function action(){
                                    fsDB.collection('client').doc('meta').collection(uid).doc('links')
                                    .collection('remotes').doc(remote_id).delete().then(() => {
                                        fsDB.collection('client').doc('meta').collection(friend_id).doc('links')
                                        .collection('remotes').doc(remote_id).delete().then(() => {
                                            render_friends_list();
                                        }).catch(error => log(error));
                                    }).catch(error => log(error));
                                }
                            });
                        }).catch(error => log(error));
                    });

                    if(link_data.size <= 0){
                        vault_friends_cont.innerHTML = empty_friend_list_holder;
                    };

                    let vault_add_friend_btn = document.getElementById('vault-add-friend-btn');
                    if(vault_add_friend_btn != null){
                        vault_add_friend_btn.addEventListener('click', ()=> {
                            setTimeout(() => {
                                history.back();
                                setTimeout(() => {
                                    location.hash = '#?addfriend';
                                }, 50);
                            }, 100)
                        })
                    }
                }).catch(error => log(error));
            }
        }(lsDB.getItem('id')));

        function switch_tab(tab_1, tab_2){
            tab_1.classList.add('hide');
            tab_2.classList.remove('hide');
        };
    };
    function render_notifications(){
        (function(uid){
            let view = `
                <div class="vault notifications" id="vault">
                    <div class="wrapper scale-up-center" id="vault-container">
                        <div class="content-wrapper">
                            <div class="header">
                                <div class="title-cont">
                                    <div class="title-cont">
                                        <img src="../src/icons/notification.svg" />
                                        <span class="title">Notifications</span>
                                    </div>
                                </div>
                                <div class="close-btn-cont" id="vault-close-btn">
                                    <img src="/src/icons/close-white.svg" alt="">
                                </div>
                            </div>
                            <div class="container-wrapper" id="">
                                <div class="notification-card" id="">
                                    <div class="identifier-cont">
                                        <span class="identifier">
                                            <img src="src/icons/add-friend-blue.svg" alt="">
                                            <span class="label">Friend request</span>
                                        </span>
                                        <span class="notification-remove-btn">
                                            Clear
                                        </span>
                                    </div>
                                    <div class="card-wrapper">
                                        <div class="notification-comp-cont">
                                            <div class="notification-info-cont">
                                                <span class="message">jenniffa@338293223 accepted your friend request.</span>
                                                <span class="id">@date</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="notification-card" id="">
                                    <div class="identifier-cont">
                                        <span class="identifier">
                                            <img src="src/icons/nimo-icon.svg" alt="">
                                            <span class="label">Nimo Community (NC)</span>
                                        </span>
                                        <span class="notification-remove-btn">
                                            Clear
                                        </span>
                                    </div>
                                    <div class="card-wrapper">
                                        <div class="notification-comp-cont">
                                            <div class="notification-info-cont">
                                                <span class="message">Hello yasvan welcome to Nimo, we hope you have a 
                                                great time making new friends and chatting. 😊</span>
                                                <span class="id">@date</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="notification-card" id="">
                                    <div class="identifier-cont">
                                        <span class="identifier">
                                            <img src="src/icons/shield.svg" alt="">
                                            <span class="label">Nimo Security</span>
                                        </span>
                                        <span class="notification-remove-btn">
                                            Clear
                                        </span>
                                    </div>
                                    <div class="card-wrapper">
                                        <div class="notification-comp-cont">
                                            <div class="notification-info-cont">
                                                <span class="message">Dear Nimo user, for security purposes we recommend
                                                you verify your email. Have a good day.</span>
                                                <span class="id">@date</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            root.insertAdjacentHTML('beforeend', view);
        }(lsDB.getItem('id')));
    };
    function initLag(){
        setTimeout(() => {
            setTimeout(()=> {
                $('#progress').addClass('reveal');
            }, 500)
            setTimeout(()=> {
                $('#progress').addClass('load');
            }, 1500)
        });
        window.oncontextmenu = function() {
            return false;
        }
        lsDB.clear();
    };
    function hide_preloader(){
        $('#spinnerx').removeClass('load');
        if($('#spinnerx').length > 0){
            $('#spinnerx').removeClass('show');
        }
    };
    function log(text){
        return console.log(text);
    };
}());