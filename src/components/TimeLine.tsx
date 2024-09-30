import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Post from "./Post";

export interface IPost {
  createdDate: number;
  photo?: string;
  video?: string;
  post: string;
  userId: string;
  username: string;
  postId: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: scroll;
  scrollbar-width: none;
  padding: 0 10px;
`;

const TimeLine = () => {
  //개수가 정해지지 않았을때, IPost[]는 배열안에 IPost의 형태의 타입이 들어올것이라고 알려주는거고, 몇개의 개수가 올지 모를때 사용하는 형태이다. 만일 개수를 안다면, 타입스크립트의 튜플 형태로 [IPost, IPost] | [] 로 타입을 지정해줄 수 있다.
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, "contents"),
        orderBy("createdDate", "desc"),
        limit(25)
      );

      // const snapshot = await getDocs(postsQuery);
      // const postData = snapshot.docs.map((doc) => {
      //   const { createdDate, photo, post, userId, username, video } = doc.data();
      //   return {
      //     postId: doc.id,
      //     createdDate,
      //     photo,
      //     video,
      //     post,
      //     userId,
      //     username,
      //   };
      // });

      unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const postData = snapshot.docs.map((doc) => {
          const { createdDate, photo, post, userId, username, video } =
            doc.data();
          return {
            postId: doc.id,
            createdDate,
            photo,
            video,
            post,
            userId,
            username,
          };
        });
        setPosts(postData);
      });
    };
    fetchPosts();
    //실시간으로 값을 받아올때만 파이어스토어의 메모리를 사용함. 해당 구문이 없을 경우에는 onSnapshot은 어떠한 사소한 변화가 있을때도 firestore의 메모리를 사용하므로 용량 소진이 급격하게 발생된다.
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {posts.map((post) => (
        <Post key={post.postId} {...post} />
      ))}
    </Wrapper>
  );
};

export default TimeLine;
