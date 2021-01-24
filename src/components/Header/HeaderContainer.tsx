import React from "react";
import Header from "./Header";
import { connect } from "react-redux";
import { logout } from "../../redux/auth-reducer";
import { StateType } from "../../redux/reduxStore";

type PropsType = {
  userId: number;
  isAuth: boolean;
  login: string | null;
};
type DispatchPropsType = {
  logout: () => void;
};
const HeaderContainer: React.FC<PropsType & DispatchPropsType> = (props) => {
  return <Header {...props} />;
};
const mapStateToProps = (state: StateType) =>
  ({
    userId: state.auth.userId,
    isAuth: state.auth.isAuth,
    login: state.auth.login,
    logout: () => {},
  } as PropsType);

export default connect<PropsType, DispatchPropsType, {}, StateType>(
  mapStateToProps,
  {
    logout,
  }
)(HeaderContainer);
