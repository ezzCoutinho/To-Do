export const handleSignOut = () => {
  signOut();
};
function signOut() {
  // Clear user authentication data from local storage or cookies
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');

  // Redirect the user to the login page
  window.location.href = '/login';
}

