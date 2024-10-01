import React, { ChangeEvent, useState } from "react";
import { IPost } from "./TimeLine";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  StorageError,
  StorageErrorCode,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

export const btnStyle = `
  background: crimson;
  color: #fff;
  border: none;
  border-radius: 5px;
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
  align-items: center;
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

const EditorColumns = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DeleteBtn = styled.button`
  ${btnStyle}
`;

const EditBtn = styled.button<{ bg?: string }>`
  ${btnStyle}
  background: ${({ bg }) => bg && bg};
`;

const EditPostFormTextArea = styled.textarea`
  background: #000;
  color: white;
  resize: none;
  width: 96%;
  height: 140px;
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  border-radius: 10px;
  transition: border 0.3s;
  &:focus {
    &::placeholder {
      opacity: 0;
    }
    outline: none;
    border: 1px solid dodgerblue;
  }
`;

const CancelBtn = styled.button<{ bg?: string }>`
  ${btnStyle}
  background: ${({ bg }) => bg && bg};
`;

const UpdateBtn = styled.button<{ bg?: string }>`
  ${btnStyle}
  background: ${({ bg }) => bg && bg};
`;

const SetContentsBtn = styled.label`
  color: #fff;
  svg {
    width: 24px;
    height: 24px;
    transition: fill 0.3s;
    cursor: pointer;
    &:hover {
      fill: dodgerblue;
    }
  }
`;

const SetContentsInputBtn = styled.input`
  display: none;
`;

const Payload = styled.p`
  font-size: 18px;
  margin: 10px 0;
`;

const Post = ({ postId, photo, post, userId, username, video }: IPost) => {
  const user = auth.currentUser?.uid;
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(post);
  const [editedPhoto, setEditedPhoto] = useState<File | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState(photo);

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

  const onEdit = () => {
    setIsEditing(true);
  };

  const onCancel = () => {
    setIsEditing(false);
  };

  const onUpdate = async () => {
    try {
      if (user !== userId) return;

      const postDoc = await getDoc(doc(db, "contents", postId));

      if (!postDoc.exists()) throw new Error("Document doesn't exist.");
      const postData = postDoc.data();
      if (postData) {
        if (postData.photo) postData.fileType = "image";
        if (postData.video) postData.fileType = "video";
      }
      const existingFileType = postData?.fileType || null;

      if (editedPhoto) {
        const newFileType = editedPhoto.type.startsWith("image/")
          ? "image"
          : "video";

        if (existingFileType && existingFileType !== newFileType) {
          alert("You can only upload the same type of files from before.");
          return;
        }
        const locationRef = ref(storage, `contents/${user}/${postId}`);
        const uploadTask = uploadBytesResumable(locationRef, editedPhoto);
        if (editedPhoto.size >= 10 * 1024 * 1024) {
          uploadTask.cancel();
          throw new StorageError(
            StorageErrorCode.CANCELED,
            "Maximum File Size(10MB) Exceeded."
          );
        }
        const result = await uploadBytes(locationRef, editedPhoto);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db, "contents", postId), {
          post: editedPost,
          photo: newFileType === "image" ? url : "",
          video: newFileType === "video" ? url : "",
        });
      } else {
        await updateDoc(doc(db, "contents", postId), { post: editedPost });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditing(false);
    }
  };

  const onChangeSetFile = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) setEditedPhoto(files[0]);
    const reader = new FileReader();
    if (files) {
      reader.onload = () => {
        if (files[0].type.startsWith("image/")) {
          setCurrentPhoto(reader.result as string);
        } else {
          alert("Wrong File Type.");
          return;
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <EditPostFormTextArea
            onChange={onChange}
            placeholder={post}
            value={editedPost}
          ></EditPostFormTextArea>
        ) : (
          <Payload>{post}</Payload>
        )}

        <EditorColumns>
          {user === userId && (
            <>
              {isEditing ? (
                <>
                  <CancelBtn onClick={onCancel} bg={"#7f8689"}>
                    Cancel
                  </CancelBtn>
                  <UpdateBtn onClick={onUpdate} bg={"dodgerblue"}>
                    Update
                  </UpdateBtn>
                  <SetContentsBtn htmlFor="edit-contents">
                    <svg
                      width={24}
                      height={24}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                      />
                    </svg>
                    <SetContentsInputBtn
                      id="edit-contents"
                      type="file"
                      accept="video/*, image/*"
                      onChange={onChangeSetFile}
                    />
                  </SetContentsBtn>
                </>
              ) : (
                <EditBtn onClick={onEdit} bg={"dodgerblue"}>
                  Edit
                </EditBtn>
              )}
              <DeleteBtn onClick={onDelete}>delete</DeleteBtn>
            </>
          )}
        </EditorColumns>
      </Column>
      <Column>
        {photo && (
          <Photo
            src={isEditing ? currentPhoto : photo}
            alt=""
            style={{
              width: isEditing ? "180px" : undefined,
              height: isEditing ? "180px" : undefined,
            }}
          />
        )}
        {video && <Video src={video} />}
      </Column>
    </Wrapper>
  );
};

export default Post;
