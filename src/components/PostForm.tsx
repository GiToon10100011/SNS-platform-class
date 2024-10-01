import React, { useState } from "react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Textarea = styled.textarea`
  background: #000;
  color: white;
  border: 2px solid white;
  border-radius: 20px;
  padding: 20px;
  font-size: 16px;
  width: 100%;
  height: 240px;
  resize: none;
  &::placeholder {
    font-size: 20px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    opacity: 1;
    transition: all 0.3s;
  }
  &:focus {
    &::placeholder {
      opacity: 0;
    }
    outline: none;
    border-color: #1d9bf9;
  }
`;

const AttachFileBtn = styled.label`
  width: 100%;
  color: #1d9bf9;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #1d9bf9;
  border-radius: 20px;
  text-align: center;
  padding: 10px 0;
  transition: all 0.3s;
  cursor: pointer;
  &:hover {
    border: 1px solid transparent;
    background: #1d9bf9;
    color: white;
  }
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background: #1d9bf9;
  font-weight: 600;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 0;
  transition: all 0.3s;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const PostForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState("");
  const [file, setFile] = useState<File | null>(null);

  //10mb 제한
  const maxFileSize = 10 * 1024 * 1024;

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (files && files.length === 1) {
      if (files[0].size > maxFileSize) {
        alert("The maximum file size had been exceeded");
        return;
      }
      setFile(files[0]);
    }
  };

  const onPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    console.log(user);
    if (!user || isLoading || post === "" || post.length > 200) return;
    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, "contents"), {
        post,
        createdDate: Date.now(),
        username: user?.displayName || "Anonymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `contents/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        const fileType = file.type;
        if (fileType.startsWith("image/")) {
          await updateDoc(doc, {
            photo: url,
          });
        }
        if (fileType.startsWith("video/")) {
          await updateDoc(doc, {
            video: url,
          });
        }
      }
      setPost("");
      setFile(null);
      // window.location.reload();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onPost}>
      <Textarea
        onChange={handleOnChange}
        name=""
        id=""
        value={post}
        placeholder="What is happening?"
        required
      ></Textarea>
      <AttachFileBtn htmlFor="file">
        {file ? file.name : "Add File"}
      </AttachFileBtn>
      <AttachFileInput
        type="file"
        id="file"
        accept="video/*, image/*"
        onChange={onFileChange}
      />
      <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post"} />
    </Form>
  );
};

export default PostForm;
