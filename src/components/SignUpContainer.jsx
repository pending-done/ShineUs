import { useState } from "react";
import supabase from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import generateRandomNickname from "../common/nicknameConstants";
import { showInputError } from "../common/utils";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 600px;
  height: 400px;
  gap: 30px;
  background-color: #ffffff;
`;

const StyledTopBox = styled.div`
  display: flex;
  align-items: center;

  img {
    height: 170px;
  }
`;

const StyledMiddleBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  input {
    width: 250px;
    height: 30px;
    border-radius: 5px;
    border: 1px solid grey;
  }
`;

const StyledBottomBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  span {
    font-size: 12px;
    text-decoration: underline;

    &:hover {
      font-weight: bold;
    }
  }
`;

const SignUpContainer = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname: generateRandomNickname()
        }
      }
    });

    // 회원가입 실패시
    error ? showInputError(error, email, password) : navigate("/");
  };

  const enterKeyHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      signUp();
    }
  };

  return (
    <StyledContainer>
      <StyledTopBox>
        <img src="./src/assets/images/shine-us-logo.png" alt="logo" />
      </StyledTopBox>
      <StyledMiddleBox>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          onKeyPress={enterKeyHandler}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          onKeyPress={enterKeyHandler}
        />
      </StyledMiddleBox>

      <StyledBottomBox>
        <button onClick={() => signUp(email, password)}>회원가입</button>
        <Link to="/signin">
          <span>로그인</span>
        </Link>
      </StyledBottomBox>
    </StyledContainer>
  );
};

export default SignUpContainer;
