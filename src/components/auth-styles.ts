import styled from "styled-components";

const Wrapper = styled.div`
  width: 420px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 0 auto;
  padding: 50px 0;
`;
const Title = styled.h1`
  font-size: 42px;
`;
const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 30px 0 10px;
`;
const Input = styled.input`
  width: 100%;
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  &[type="submit"] {
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
  &:focus {
    outline: none;
  }
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

const Switcher = styled.span`
  a {
    color: dodgerblue;
    margin-left: 10px;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const authStyles = {
  Wrapper,
  Title,
  Form,
  Input,
  Error,
  Switcher,
};

export default authStyles;
