import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket'
import UniVerseLogo from '../assets/images/logo-universe.png'
import HomeIcon from '../assets/icons/icon-home.svg'
import NewsIcon from '../assets/icons/icon-newspaper.svg'
import JobsIcon from '../assets/icons/icon-job.svg'
import EventsIcon from '../assets/icons/icon-calendar.svg'
import ChatsIcon from '../assets/icons/icon-chat.svg'
import SettingsIcon from '../assets/icons/icon-cog.svg'
import useLogout from '../hooks/useLogout';
import { FaUserAstronaut } from "react-icons/fa";
import useProfilePicture from '../hooks/useProfilePicture';
import { MdAdminPanelSettings } from "react-icons/md";

const Sidebar = () => {
  const location = useLocation();
  const { auth } = useAuth();
  const logout = useLogout();
  const { disconnectSocketClient, sendIsOnlineAlert } = useSocket();

  const navigate = useNavigate();

  const { profilePicture } = useProfilePicture("profilePictureSidebar", auth?.user);

  const handleLogout = async () => {
    await logout();
    sendIsOnlineAlert(auth?.user);
    disconnectSocketClient();
    navigate('/');
  }

  const isActive = (path) =>{
    return location.pathname.includes(path) ? 'link-btn' : 'link-btn-off'
  }

  const linksData = [
    { id: 1, to: '/home', text: 'Home', icon: HomeIcon },
    { id: 2, to: '/news', text: 'News', icon: NewsIcon },
    { id: 3, to: '/jobs', text: 'Jobs', icon: JobsIcon },
    { id: 4, to: '/events', text: 'Events', icon: EventsIcon},
    { id: 5, to: '/chats', text: 'Chats', icon: ChatsIcon }
  ];

  return (
      <aside className='sidebar'>
        <div className='logo-container'>
          <img src={UniVerseLogo}/>
          UniVerse
        </div>
        {auth?.role === "ADMIN" &&
            <div className='admin-nav-button-container'>
              <Link to="/admin" className='link'>
                <button className={isActive("/admin")}>
                  <MdAdminPanelSettings className='link-icon'/>
                  Admin
                </button>
              </Link>
            </div>
        }
        <div className='profile-container'>
          <div className='profile-picture'>
            {profilePicture?.size > 0 ?
                <img src={URL.createObjectURL(profilePicture)} alt="ProfilePicture" />
                :
                <FaUserAstronaut className='profile-picture-placeholer-icon'/>}
          </div>
          <label className='username' onClick={() => navigate(`/profile/${auth.user}`)}>{auth.user}</label>
          <button onClick={handleLogout} className='confirm-button'>Log Out</button>
        </div>

        <ul>
          {linksData.map((link) =>
              <li key={link.id}>
                <Link key={link.id} to={link.to} className='link'>
                  <button key={link.id} className={isActive(link.to)}>
                    <img src={link.icon} className='link-icon'/>
                    {link.text}
                  </button>
                </Link>
              </li>
          )}
        </ul>

        <Link to='/settings' className='link settings-link'>
          <button className={isActive('/settings')}>
            <img src={SettingsIcon} className='link-icon'/>
            Settings
          </button>
        </Link>
      </aside>
  )
}

export default Sidebar
