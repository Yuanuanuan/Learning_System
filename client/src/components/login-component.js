import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const LoginComponent = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    console.log(email, password);
    try {
      let res = await AuthService.login(email, password);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        <div className="form-group">
          <label htmlFor="username">電子信箱：</label>
          <input
            onChange={handleEmail}
            type="text"
            className="form-control"
            name="email"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">密碼：</label>
          <input
            onChange={handlePassword}
            type="password"
            className="form-control"
            name="password"
          />
        </div>
        <br />
        <div className="form-group">
          <button onClick={handleLogin} className="btn btn-primary btn-block">
            <span>登入系統</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
