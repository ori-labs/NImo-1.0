import utilities from "../../utilities/utilities.js";

const home = {
    render: async () => {
        let view = `
            <div class="head">
                <div class="left-cont">
                    <div class="h-prof">
                        <span class="h-prof-img r-100" style="background-image: url('src/imgs/avatar.svg');">
                        </span>
                        <span class="h-usr-name"><b class="id h-uid"></b></span>
                    </div>
                    <div class="h-top-btn">
                        <div class="btn-cont">
                            <span>
                                <img class="sett" src="src/icons/settings.svg" alt="">
                            </span>
                        </div>
                        <div class="btn-cont">
                            <span>
                                <img class="noti" src="src/icons/noti.svg" alt="">
                            </span>
                        </div>
                        <div class="btn-cont">
                            <span>
                                <img class="frnd" src="src/icons/friends.svg" alt="">
                            </span>
                        </div>
                    </div>
                </div>
                <div class="mark">
                    <img src="src/logo/nimo.svg" alt="">
                </div>
            </div>
            <div class="content" id="content-container">
                <div class="h-content">
                    <div class="h-content-wraper">
                        <div class="top-cont">
                            <button class="explore-rooms">
                                <img src="/src/icons/explore.svg" />
                                <span>Explore rooms</span>
                            </button>
                            <button class="create-room">
                                <img src="/src/icons/add-icon.svg" />
                                <span>Create room</span>
                            </button>
                        </div>
                        <div class="content-wrapper">
                            <div class="friend-cont">
                                <div class="title-cont">
                                    <img src="/src/icons/chats.svg">
                                    <span>Friends</span>
                                </div>
                                <div class="list-cont" id="f_list">
                                    <span class="spn">
                                        <img src="/src/assets/spinner-1.svg" />
                                    </span>
                                </div>
                            </div>
                            <div class="rooms-cont">
                                <div class="title-cont">
                                    <img src="/src/icons/rooms.svg">
                                    <span>Rooms</span>
                                </div>
                                <div class="list-cont">
                                    <span class="spn">
                                        <img src="/src/assets/spinner-r.svg" />
                                    </span>
                                    <!--<div class="room-card">
                                        <div class="room-pfp-cont">
                                            <span class="r-pfp" style="background-image: url('/src/imgs/avatar.svg')"></span>
                                        </div>
                                        <span class="r-name">City Worriors 
                                        [escape reality] </span>
                                    </div>
                                    <div class="NOR">
                                            <img src="/src/assets/nor.svg" />
                                            <span class="nof-title">You have not joined any rooms yet!</span>
                                            <span class="hr"></span>
                                            <button class="nof-btn">Join room</button>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sanmoji-snippet moji-cont" id="san-moji-snippet">
            </div>
            <div class="snippet-wrapper" id="right-prof-snipper">
                <div class="pfp-snippet">
                    <span class="banner sn-banner"></span>
                    <div class="profile-cont">
                        <div class="pfp-cont">
                            <span class="pfp sn-pfp"
                                style="background-image: url('src/imgs/avatar.svg');"
                            ></span>
                            <div class="badge-wrapper">
                                <span class="offset"></span>
                                <div class="bagde-cont">
                                    <span class="bagde" style="background-image: url('/src/assets/bagde/warden.svg')"></span>
                                </div>
                                <div class="bagde-cont">
                                    <span class="bagde" style="background-image: url('/src/assets/bagde/pro.svg')"></span>
                                </div>
                                <div class="bagde-cont">
                                    <span class="bagde" style="background-image: url('/src/assets/bagde/watcher.svg')"></span>
                                </div>
                            </div>
                        </div>
                        <div class="name-cont">
                            <span class="usrname sn-uname">Hara<b class="id sn-id">#388</b></span>
                        </div>
                        <div class="bio sn-bout">Lakes that are above the sea lavel aren’t concidered simply cuz they’re below the sea level 😄.</div>
                    </div>
                </div>
            </div>
            <div class="focus" id="focus-cont">
                <span id="focus-img">
                    <div class="caption-cont" id="caption-cont">
                        <span class="caption" id="caption"></span>
                        <a class="img-save-cont" id="save-img-btn">
                            <img src="/src/icons/save.svg">
                        </a>
                    </div>
                </span>
            </div>
        `;

        return view;
    },
    after_render: async () => {
        clearLag();
        document.title = 'Nimo - Home';
        let auth = firebase.auth(),
        _fsDb = firebase.firestore(),
        _fstrg = firebase.storage(),
        _rtDb = firebase.database();

        let _lstrg = localStorage;
        let _usr_ = _lstrg.getItem('deamon');

        const getUdata = () => {
            firebase.firestore().collection('/client').doc(_usr_).collection(_usr_).doc('udata').get()
            .then((sn) => {
                $('#spinnerx').removeClass('load');
                if($('#spinnerx').length > 0){
                    $('#spinnerx').removeClass('show');
                }
                const data = sn.data();
                document.querySelector('.h-usr-name').innerHTML = `${data.user}`;
                document.querySelector('.h-prof-img').style.backgroundImage = `url(${data.userProfileAvatar || '/src/imgs/avatar.svg'})`;
                document.querySelector('.h-prof-img').style.backgroundColor = `${data.userProfileBackDrop}`;
                _lstrg.setItem('cache', [data.user, data.userProfileAvatar || null, data.userProfileBackDrop])
                _lstrg.setItem('client', data.user);
            }).catch((err) => {
                console.log('something went wrong')
            })
        }
        const renderHome = {
            _getFriends: () => {
                let dfCard = `
                    <div class="NOF">
                        <img src="/src/assets/nof.svg" />
                        <span class="nof-title">It’s quiet for now!</span>
                        <span class="hr"></span>
                        <span class="nof-sub">Add your friend to start chatting now!</span>
                        <button class="nof-btn">Add friend</button>
                    </div>
                `
                let _daemon = _lstrg.getItem('deamon'),
                    fListCont = document.getElementById('f_list'),
                        spmc = 0;
                firebase.firestore().collection('/client').doc(_usr_).collection(_usr_).doc('chats').collection('node')
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
                        fListCont.innerHTML = dfCard;
                    }
                })
                
                function  renderFnd(_fID, _cID){
                    fListCont.innerHTML = '';
                    _fsDb.collection('/client').doc(_fID).collection(_fID)
                    .doc('udata').get().then((sn) => {
                        const _dval = sn.data();
                        let fCard = `
                            <div class="friend-card" id="fid=${_fID}">
                                <div class="friend-pfp-cont">
                                    <span class="f-pfp" style="background-image: url(${_dval.userProfileAvatar || '/src/imgs/avatar.svg'});background-color: ${_dval.userProfileBackDrop};"></span>
                                    <!-- <span class="bagde">9+</span> -->
                                </div>
                                <span class="f-uname">${_dval.user}</span>
                            </div>
                        `;
                        fListCont.insertAdjacentHTML('beforeend', fCard);
                        const _FBtn = document.getElementById(`fid=${_fID}`);

                        _FBtn.addEventListener('click', (e)=> {
                            e.preventDefault();
                            window.location.hash = '/nimo-app#chats'
                            _lstrg.setItem('_fRay', _fID);
                            _lstrg.setItem('_fcRay', _cID);
                        })
                        
                    })
                }
                console.log("logged in as " + _daemon)
            },
            _getRooms: () => {

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
                        window.history.back();
                    }
                };
            },
            onElementClose: (ac) => {
                document.onkeydown = function(evt) {
                    evt = evt || window.event;
                    let isEscape = false;
                    if ("key" in evt) {
                        isEscape = (evt.key === "Escape" || evt.key === "Esc");
                    } else {
                        isEscape = (evt.keyCode === 27);
                    }
                    if (isEscape) {
                        ac();
                    }
                };
            },
            outClick: (id, ac) => {
                document.addEventListener("mouseup", function(event) {
                    let obj = document.getElementById(id);
                    if(obj != null) {
                        if (!obj.contains(event.target)) {
                            ac();
                        }
                    }
                });
            }

        }

        try {
            renderHome._getFriends();
            getUdata();
        } catch (error) {
            console.log('something went wrong', error);
            location.reload();
        }
        

        let focusCont = document.getElementById('focus-cont'),
            focusImg = document.getElementById('focus-img');

        if(focusCont != null){
            if(focusCont.style.display !== 'flex'){
                events.onElementClose(() => {
                    focusCont.style.display = 'none';
                    focusImg.style.backgroundImage = 'none';
                })
                events.outClick(focusImg.id, ()=> {
                    focusCont.style.display = 'none';
                    focusImg.style.backgroundImage = 'none';
                })
            }
        }


        // document.querySelector('.nof-btn').addEventListener('click', ()=> {
        //     window.location.hash = '/chat'
        // })
        // function getMention(msg){
        //     let mentionReg = /(@[^\s]+)/g;
        //     return msg.replace(mentionReg, function(mention){
        //         return '<b class="name-mention">' + mention + '</b>';
        //     })
        // }
        // let msg = 'Hii @hara check this cute teddy @hara',
        //     mention = getMention(msg);
        // console.log(mention);
        

        function clearLag(){
            (function(){
                localStorage.removeItem('_fRay')
                localStorage.removeItem('_fcRay')
                localStorage.removeItem('_metaSwitch');
                localStorage.removeItem('switchRay');
                localStorage.removeItem('isReply');
                localStorage.removeItem('replyID');
                localStorage.removeItem('replyMsg');
                localStorage.removeItem('replyUserName');
                localStorage.removeItem('replyUserAvatar');
                localStorage.removeItem('replyUserID');
                localStorage.removeItem('attachment');
                localStorage.removeItem('hasAttachment');
                localStorage.removeItem('desc');
            }())
        }

        // ((function(){
        //     toggleImgPicker();
        //     function toggleImgPicker(){
        //         let imgToggle = document.getElementById('img-toggle'),
        //             _pickerCont = document.getElementById('image-picker-cont'),
        //             _spinn = document.getElementById('spin'),
        //             _imgPicker = document.getElementById('img-picker'),
        //             _imgDisplayer = document.getElementById('img-displayer'),
        //             _imgInput = document.getElementById('image-file'),
        //             _displayer = document.getElementById('displayer'),
        //             _pickerErr = document.getElementById('img-picker-error'),
        //             _cancelBtn = document.getElementById('cancel-btn');

        //         imgToggle.addEventListener('click', (e) => {
        //             e.preventDefault();
        //             console.log('picking image')
        //             if(_pickerCont != null){
        //                 _pickerCont.style.display = 'flex';

        //                 imgToggle.isdisabled = true;
        //                 imgToggle.style.cursor = 'not-allowed'
        //                 setTimeout(() => {
        //                     _spinn.style.display = 'none';
        //                     if(_imgDisplayer.style.display != 'flex'){
        //                         _imgPicker.style.display = 'flex';
        //                     }
        //                 }, 300)
        //             }
        //         })

        //         _cancelBtn.addEventListener('click', (e) =>{
        //             e.preventDefault();

        //             if(_imgDisplayer.style.display != 'none'){
        //                 _imgDisplayer.style.display = 'none';
        //                 _imgPicker.style.display = 'flex';
        //                 _pickerErr.style.display = 'none';
        //             }
        //             _lstrg.removeItem('attachment');
        //             _lstrg.removeItem('hasAttachment');
        //             _lstrg.removeItem('desc');
        //         })

        //         let _uid = _lstrg.getItem('deamon');

        //         _imgInput.addEventListener('change', () => {
        //             _gImgData();
        //         })

        //         function _gImgData(){
        //             _pickerErr.style.display = 'none';
        //             _imgPicker.style.display = 'none';
        //             _imgDisplayer.style.display = 'flex';
                    
        //             const files = _imgInput.files[0];

        //             let _progLayer = document.getElementById('_prog-layer'),
        //                 _progBar = document.getElementById('_prog-bar'),
        //                 _fileDesc = document.getElementById('file-desc');

        //             console.log("FileName", files)
        //             const uploadTask = _fstrg.ref(`client/${_uid}`).child(files.name).put(files);

        //             uploadTask.on('state_changed', (snapshot) => {
        //                     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            
        //                     let _height_ = (Math.floor(progress) * 70) / 100;
        //                     let _cheight = Math.floor(70 - (Math.floor(progress) * 70) / 100)

        //                     _progLayer.style.height = `${_cheight}px`;
        //                     _progBar.style.width = `${Math.floor(progress)}%`;
        //                     if(Math.floor(progress) == 100){
        //                         document.querySelector('.prog-bg').style.display = 'none';
        //                     }
        //                 },
        //                 (error) => {
        //                     if(_imgDisplayer.style == 'flex'){
        //                         _imgDisplayer.style.display = 'none';
        //                         _pickerErr.style.display = 'flex';
        //                     }
        //                     worker._sn._Err('Couldn\'t upload the image, please try again later!', _errH);
        //                     console.log("error:-", error)
        //                 },
        //                 () => {
        //                     uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        //                         console.log('File available at', downloadURL);
        //                         let attachment = downloadURL.toString(),
        //                             hasAttachment = true,
        //                             desc =  _fileDesc.innerText;

        //                         _lstrg.setItem('hasAttachment', hasAttachment);
        //                         _lstrg.setItem('attachment', attachment);
        //                         _lstrg.setItem('desc', desc);

        //                         // _fsDb.collection("client").doc(_stds_)
        //                         // .collection(_stds_)
        //                         // .doc('udata').set({
        //                         //     userProfileAvatar: downloadURL.toString(),
        //                         // })
        //                         // .then(() => {
        //                         //     // console.log("Document successfully written!");
        //                         //     _lstrg.setItem('_pfp', downloadURL.toString())
        //                         // })
        //                         // .catch((error) => {
        //                         //     worker._sn._Err('Something went wrong, please try again later!', _errH)
        //                         //     console.error("Error writing document: ", error);
        //                         // });
        //                     });
        //                 }
        //             )
        //             if(files){
        //                 const _fReader = new FileReader();
        //                 _fReader.readAsDataURL(files);
        //                 _fileDesc.innerText = files.name
        //                 _fReader.addEventListener('load', function(){
        //                     _displayer.style.backgroundImage = `url('${this.result}')`;
        //                     _displayer.style.backgroundSize = 'cover';
        //                     _displayer.style.backgroundPosition = 'center';
        //                 })
        //                 _fileDesc.innerText = utilities.trimFileName(files.name)
                        
        //             }
        //         }
        //     }
        // }()))
        // (function(){
        //     setTimeout(() => {
        //         const __prldMsg = [
        //             [
        //             '',
        //             'Loading Nimo interface',
        //             'Fetching data',
        //             'Loading',
        //             ' '
        //             ],
        //             [
        //             `<span class="_preload-msg">Do you know that you can navigate easily with the help of  <b class="key">ESC</b> key! </span>`
        //             ]
        //         ]
        //         let __preldT = document.querySelector('._preload-t-2'),
        //             __preldB = document.querySelector('._preload-b-2');

        //         __preldT.innerText = __prldMsg[0][Math.floor(Math.random() * __prldMsg[0].length)]
        //         __preldB.insertAdjacentHTML('beforeend', __prldMsg[1][Math.floor(Math.random() * __prldMsg[1].length)])
        //     })
        // }())
        return;
    }
}


export default home;