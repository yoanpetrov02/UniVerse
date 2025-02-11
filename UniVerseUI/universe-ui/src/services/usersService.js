import axios from "../api/axios";

export const getUsers = async () =>{
    const response = await axios.get('/users');
    return response.data;
}

export const getUsersByFilter = async (filter) =>{
    const response = await axios.get(`/users/search/${filter}`);
    return response.data;
}

export const userExists = async (username) =>{
    const response = await axios.get(`/users/exists/${username}`);
    return response.data;
}

export const getUserByName = async (username) =>{
    const response = await axios.get(`/users/${username}`);
    return response.data;
}

export const getUserOnlineFriends = async (username) =>{
    const response = await axios.get(`/friendships/${username}/online-friends`);
    return response.data;
}

export const getUserFriendsCount = async (username) =>{
    const response = await axios.get(`/friendships/${username}/count`);
    return response.data;
}

export const getUserProfilePicture = async (username) =>{
    const response = await axios.get(`/users/${username}/profile-picture`, { responseType: 'blob'});
    return response.data;
}

export const getUserFriendRequests = async (username) =>{
    const response = await axios.get(`/friendships/${username}/friend-requests`);
    return response.data;
}

export const checkFriendship = async (usernameUser1, usernameUser2) => {
    const response = await axios.get('/friendships/check-friendship', {
        params: {
            usernameUser1,
            usernameUser2,
        },
    });

    return response.data;
};

export const addFriend = async ({ loggedInUser, profileUser }) =>{
    const response = await axios.post(`/friendships/${loggedInUser}/add-friend/${profileUser}`);
    return response.data;
}

export const acceptFriendRequest = async (friendshipId) =>{
    const response = await axios.post(`/friendships/accept-friend-request/${friendshipId}`);
    return response.data;
}

export const removeFriend = async ({ loggedInUser, profileUser }) =>{
    const response = await axios.delete(`/friendships/${loggedInUser}/remove-friend/${profileUser}`);
    return response.data;
}

export const rejectFriendRequest = async (friendshipId) =>{
    const response = await axios.delete(`/friendships/reject-friend-request/${friendshipId}`);
    return response.data;
}

export const confirmPassword = async ({ username, password }) =>{
    const details = { username: username, email: "", password: password };

    const response = await axios.post('/users/confirm-password', details);
    return response.data;
}

export const updateUserProfile = async (data) =>{
    const response = await axios.post('/users/update-profile', data);
    return response.data;
}

export const getUserRegistrationRequests = async () =>{
    const resposne = await axios.get('/users/registration-requests')
    return resposne.data;
}

export const approveUser = async (userId) => {
    const response = await axios.put(`/users/${userId}/approve`);
    return response.data;
}

export const rejectUser = async (userId) => {
    const response = await axios.delete(`/users/${userId}/reject`);
    return response.data;
}
