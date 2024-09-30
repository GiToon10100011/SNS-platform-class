import React, { useState } from "react";
import { IPost } from "./TimeLine";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  StorageError,
  StorageErrorCode,
} from "firebase/storage";

const btnStyle = `
  background: crimson;
  color: #fff;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    opacity: 0.8;
  }
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 14px;
  gap: 10px;
  padding: 20px;
`;

const Column = styled.div`
  &:last-child {
    justify-self: end;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 14px;
`;

const Video = styled.video`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 14px;
`;

const Username = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const DeleteBtn = styled.button`
  ${btnStyle}
`;

const EditBtn = styled.button<{ bg?: string }>`
  ${btnStyle}
  background: ${({ bg }) => bg && bg};
`;

const Payload = styled.p`
  font-size: 18px;
  margin: 10px 0;
`;

const Post = ({
  postId,
  createdDate,
  photo,
  post,
  userId,
  username,
  video,
}: IPost) => {
  const user = auth.currentUser?.uid;
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(post);
  const [editedPhoto, setEditedPhoto] = useState<File | null>(null);
  const onDelete = async () => {
    if (user !== userId) return;
    const ok = confirm("Are you sure you want to delete this post?");
    if (!ok || user !== userId) return;
    try {
      await deleteDoc(doc(db, `contents`, postId));
      if (photo || video) {
        const photoRef = ref(storage, `contents/${user}/${postId}`);
        await deleteObject(photoRef);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedPost(e.target.value);
  };

  const onCancel = () => {
    setIsEditing(false);
  };

  const onEdit = async () => {
    setIsEditing(true);
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{post}</Payload>
        {user === userId && <DeleteBtn onClick={onDelete}>delete</DeleteBtn>}
        {user === userId && (
          <EditBtn onClick={onEdit} bg={"dodgerblue"}>
            Edit
          </EditBtn>
        )}
      </Column>
      <Column>
        {photo && <Photo src={photo} alt="" />}
        {video && <Video src={video} />}
      </Column>
    </Wrapper>
  );
};

export default Post;
