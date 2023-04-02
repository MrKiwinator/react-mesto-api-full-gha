import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import ProtectedRoute from "./ProtectedRoute";
import api from "../utils/api";
import auth from "../utils/auth"
import { CurrentUserContext } from "../context/CurrentUserContext";

function App() {
    // =================== HOOKS ========================
    
    // ======= Hooks for popup/modal: =======

    const [isEditProfileOpen, setEditProfileStatus] = React.useState(false);
    const [isAddPlaceOpen, setAddPlaceStatus] = React.useState(false);
    const [isEditAvatarOpen, setEditAvatarStatus] = React.useState(false);
    const [isInfoTooltipOpen, setInfoTooltipOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [tooltipStatus, setTooltipStatus] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    // true if one of popups is opened:
    const isOpen = isEditAvatarOpen || isEditProfileOpen || isAddPlaceOpen || selectedCard;

    React.useEffect(() => {
        function closeByEscape(evt) {
            if(evt.key === 'Escape') {
                // if InfoTooltip:
                if(isInfoTooltipOpen) {
                    closeInfoTooltip()
                // if other popups:
                } else {
                    closeAllPopups();
                }
          }
        }
        if(isOpen || isInfoTooltipOpen) {
        
            document.addEventListener('keydown', closeByEscape);
            return () => {
              document.removeEventListener('keydown', closeByEscape);
            }
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, isInfoTooltipOpen]) 

    // ======= Hook for current user email: =======

    const [userEmail, setUserEmail] = React.useState(null);

    // ======= Hook for user edit: =======

    const [currentUser, setCurrentUser] = React.useState({});

    // ======= Hook for cards: =======

    const [cards, setCards] = React.useState([]);

    // ======= Hook for navigation: =======

    const navigate = useNavigate();

    // ======= Hook for burger-menu: =======
    
    const [isBurgerMenuOpen, setBurgerMenuOpen] = React.useState(false);

    // ======= Registration hooks: =======

    const [formRegValue, setFormRegValue] = React.useState({
        email: '',
        password: '',
    })

    // ======= Login hooks: =======

    const [formLoginValue, setFormLoginValue] = React.useState({
        email: '',
        password: '',
    })

    const [loggedIn, setLoggedIn] = React.useState(false);

    React.useEffect(() => {

        // getting userId from the localStorage:
        const userId = localStorage.getItem('userId');

        // if userId exist let user to pass auth:
        if (userId) {
            setLoggedIn(true);
            navigate("/", {replace: true});
        }
        
        // if user loggedIn send reqest on server to get required data:
        if (loggedIn) {
            Promise.all([api.getUserInfo(), api.getCards()])
            .then(([userInfo, cards]) => {
                setCurrentUser(userInfo);
                setCards(cards);
                setUserEmail(userInfo.email);
            })
            .catch((err) => console.log(err))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedIn])

    // =====================//////////==========================
    

    // ============== POPUP, MODAL AND BURGER-MENU CONTROL ===================

    function handleEditProfileClick() {
        setEditProfileStatus(!isEditProfileOpen);
    }

    function handleAddPlaceClick() {
        setAddPlaceStatus(!isAddPlaceOpen);
    }

    function handleEditAvatarClick() {
        setEditAvatarStatus(!isEditAvatarOpen);
    }

    function closeAllPopups() {
        setEditProfileStatus(false);
        setAddPlaceStatus(false);
        setEditAvatarStatus(false);
        setSelectedCard(null);
    }

    function closeInfoTooltip() {
        setInfoTooltipOpen(false);
        
        if (tooltipStatus === "success") {
            setFormLoginValue({email: '', password: ''});
            navigate('/sign-in', {replace: true});
        }
    }

    // ======= Burger-menu handler: =======

    const handleBurgerMenuClick = () => {
        setBurgerMenuOpen(!isBurgerMenuOpen);
    }

    // =====================//////////==========================


    // =================== FORM HANDLERS ========================

    const buttonText = isLoading ? "Сохранение..." : "Сохранить"

    function handleCardLike(card) {
        const isLiked = card.likes.some(userId => userId === currentUser._id);
        
        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards(state => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch((err) => console.log(err))
    }

    function handleCardDelete(card) {
        api.delCard(card._id)
            .then(() => {
                setCards((state) => state.filter((item) => item._id !== card._id)); 
            })
            .catch((err) => console.log(err))
    }

    function handleUpdateUser(userInfo) {
        setIsLoading(true);

        api.setUserInfo(userInfo)
            .then((res) => {
                setCurrentUser(res);
                closeAllPopups();
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setIsLoading(false);
            })
    }

    function handleUpdateAvatar(userInfo) {
        setIsLoading(true);

        api.setUserAvatar(userInfo.avatar)
            .then((res) => {
                setCurrentUser(res);
                closeAllPopups();
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setIsLoading(false);
            })
    }

    function handleAddPlaceSubmit(card) {
        setIsLoading(true);

        api.addCard(card)
            .then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setIsLoading(false);
            })
    }

    // ======= Registration of new user: =======

    const handleRegInputChange = (e) => {
        const {name, value} = e.target;
    
        setFormRegValue({
            ...formRegValue,
            [name]: value
        });
    }

    const handleUserRegSubmit = (e) => {
        e.preventDefault();
        
        const { email, password } = formRegValue;
        auth.register(email, password)
            .then(() => {
                setTooltipStatus("success")
            })
            .catch(() => {
                setTooltipStatus("failed");  
            })
            .finally(() => {
                setInfoTooltipOpen(true);
            })
    }

    // ======= User login: =======

    const handleLoginChange = (e) => {
        const {name, value} = e.target;
    
        setFormLoginValue({
            ...formLoginValue,
            [name]: value
        });
    }

    const handleLogin = () => {
        setLoggedIn(true);
    }

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        
        if (!formLoginValue.email || !formLoginValue.password) {
            return;
        }

        auth.authorize(formLoginValue.email, formLoginValue.password)
            .then((data) => {
                if (data._id) {
                    setUserEmail(formLoginValue.email);
                    setFormLoginValue({email: '', password: ''});
                    handleLogin(e);
                    navigate('/', {replace: true});
                }
            })   
            .catch(() => {
                setTooltipStatus("failed");
                setInfoTooltipOpen(true);
            })
    }

    // ======= User logout: =======

    const handleLogout = (e) => {
        e.preventDefault();

        auth.logout(currentUser._id)
        setBurgerMenuOpen(false);
        setLoggedIn(false);
        navigate("/sign-in", {replace: true});
        localStorage.removeItem("userId");
    }

    // =====================//////////==========================


    // ======================= JSX ============================

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <Header 
                loggedIn={loggedIn} 
                userEmail={userEmail}
                signOut={handleLogout}
                handleClick={handleBurgerMenuClick}
                isOpen={isBurgerMenuOpen}
            />

            <Routes>
                <Route 
                    path="/sign-up" 
                    element={
                        <Register 
                            handleSubmit={handleUserRegSubmit}
                            handleChange={handleRegInputChange}
                            formValue={formRegValue}
                        />
                    } 
                />
                <Route 
                    path="/sign-in" 
                    element={
                        <Login 
                            handleSubmit={handleLoginSubmit}
                            handleChange={handleLoginChange}
                            formValue={formLoginValue}
                        />
                    }
                />
                <Route 
                    path="/"
                    element={
                        <>
                            <ProtectedRoute
                                // In user logged in show Main component, else redirect to /sign-in page:
                                loggedIn={loggedIn}
                                element={Main}
                                cards={cards} 
                                onEditProfile={handleEditProfileClick} 
                                onAddPlace={handleAddPlaceClick} 
                                onEditAvatar={handleEditAvatarClick} 
                                onCardClick={setSelectedCard}
                                onCardLike={handleCardLike} 
                                onCardDelete={handleCardDelete} 
                            />
                            <Footer />

                            <ImagePopup 
                                card={selectedCard} 
                                onClose={closeAllPopups} 
                            />
                    
                            <EditProfilePopup 
                                isOpen={isEditProfileOpen} 
                                onClose={closeAllPopups} 
                                onUpdateUser={handleUpdateUser}
                                submit={buttonText}
                            /> 

                            <EditAvatarPopup 
                                isOpen={isEditAvatarOpen} 
                                onClose={closeAllPopups} 
                                onUpdateAvatar={handleUpdateAvatar}
                                submit={buttonText}
                            />
                    
                            <AddPlacePopup 
                                isOpen={isAddPlaceOpen}
                                onClose={closeAllPopups}
                                onAddPlace={handleAddPlaceSubmit}
                                submit={buttonText}
                            />
                    
                            <PopupWithForm 
                                name="delete-image" 
                                title="Вы уверены?" 
                                submit="Да" 
                                onClose={closeAllPopups} 
                            />
                        </>
                    }
                />
            </Routes>
            <InfoTooltip 
                tooltipStatus={tooltipStatus}
                isOpen={isInfoTooltipOpen}
                onClose={closeInfoTooltip}
            />
        </CurrentUserContext.Provider>
    );
}

export default App;
