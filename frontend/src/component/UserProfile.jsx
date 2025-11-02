import { useSelector } from "react-redux";
import { selectUser, selectIsAuthenticated } from "../redux/slices/authSlice";

const UserProfile = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <p>Email: {user.email}</p>
      <p>User ID: {user.id}</p>
    </div>
  );
};

export default UserProfile;
