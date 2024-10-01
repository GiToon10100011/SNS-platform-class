import React, { ChangeEvent, useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import styled from "styled-components";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { IPost } from "../components/TimeLine";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Post, { btnStyle } from "../components/Post";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  background: transparent;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
  object-fit: cover;
`;

const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span``;

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const ChangeNameButton = styled.button`
  background: #3b3a3a;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
`;

const CancelBtn = styled.button`
  ${btnStyle};
`;

const NameInput = styled.input`
  background: #000;
  color: white;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  padding: 4px 14px;
  font-size: 18px;

  &:focus {
    outline: none;
  }
`;

const Profile = () => {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL || null || undefined);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [name, setName] = useState(user?.displayName ?? "Guest");
  const [editMode, setEditMode] = useState(false);

  const onAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(locationRef);
      await updateProfile(user, { photoURL: avatarUrl });
      setAvatar(avatarUrl);
    }
  };

  const fetchPosts = async () => {
    const postQuery = query(
      collection(db, "contents"),
      where("userId", "==", user?.uid),
      orderBy("createdDate", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(postQuery);
    const posts = snapshot.docs.map((doc) => {
      const { createdDate, photo, video, post, userId, username } = doc.data();
      return {
        createdDate,
        photo,
        video,
        post,
        userId,
        username,
        postId: doc.id,
      };
    });
    setPosts(posts);
  };

  const handleOnChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleOnConfirmName = async () => {
    if (!user) return;
    setEditMode((current) => !current);
    if (!editMode) return;
    try {
      await updateProfile(user, { displayName: name });
    } catch (error) {
      console.error(error);
    } finally {
      setEditMode(false);
    }
  };

  const handleOnCancel = () => {
    setEditMode(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {Boolean(avatar) ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
            />
          </svg>
        )}
        <AvatarImg />
      </AvatarUpload>
      <AvatarInput
        id="avatar"
        type="file"
        accept="image/*"
        onChange={onAvatarChange}
      />
      {editMode ? (
        <NameInput value={name} onChange={handleOnChangeName} />
      ) : (
        <Name>{user?.displayName || "Guest"}</Name>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <ChangeNameButton onClick={handleOnConfirmName}>
          {editMode ? "Save" : "Edit"}
        </ChangeNameButton>
        {editMode && <CancelBtn onClick={handleOnCancel}>Cancel</CancelBtn>}
      </div>

      <Posts>
        {posts.map((post) => (
          <Post key={post.postId} {...post} />
        ))}
      </Posts>
    </Wrapper>
  );
};

export default Profile;
