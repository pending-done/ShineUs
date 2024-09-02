import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
// import MainPageTag from "./MainPageTag";
import supabase from "../supabaseClient";
import { useShine } from "../context/ShineContext";
import WriteCommentForm from "./WriteCommentForm";
import CommentList from "./CommentList";

const MainPagePosts = ({ posts, likesAndComments, handleLike, handleComments }) => {
  const [displayedPosts, setDisplayedPosts] = useState(posts.slice(0, 5));

  const [page, setPage] = useState(1); // 현재 페이지 상태
  const { user } = useShine();
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(-1);

  const observerRef = useRef(); // 마지막 dom요소를 추적할 ref

  // loadMorePosts 함수 선언 - 새로운 포스트 로드
  const loadMorePosts = () => {
    const nextPage = page + 1;
    const newPosts = posts.slice(0, nextPage * 5);
    setDisplayedPosts(newPosts);
    setPage(nextPage);
  };

  // useEffect(() => {
  //   setDetailPosts(posts);
  // }, []);

  //displayedPosts 올리면 실행
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect?.();

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [displayedPosts, page]);

  // 새 포스트 업로드 되면 렌더링
  useEffect(() => {
    setDisplayedPosts(posts.slice(0, page * 10));
  }, [posts, page]);

  // ref로 마지막 요소 감지 함수
  const getObserverRef = (index, displayedPosts, observerRef) => {
    return index === displayedPosts.length - 1 ? observerRef : null;
  };

  const toggleCommentForm = (index) => {
    setIsCommentFormVisible(index);
  };

  return (
    <StyledContainer>
      {displayedPosts.map((post, index) => (
        <StyledPostBox key={post.id} ref={getObserverRef(index, displayedPosts, observerRef)}>
          <div className="display-post-tags">
            {post.tags &&
              typeof post.tags === "string" &&
              post.tags.split(", ").map((tag, index) => <span key={index}>#{tag} </span>)}
          </div>
          <h3>{post.nickname}</h3>
          <span onClick={() => handleLike(post.id)}>
            {likesAndComments[post.id]?.is_like ? `♥` : `♡`}
            {likesAndComments[post.id]?.like_count}
            {post.userinfo.nickname}
          </span>
          <p>{post.contents}</p>
          {post.img_url && <StyledImage src={post.img_url} />}

          <button onClick={() => toggleCommentForm(index)}>댓글 달기</button>
          {isCommentFormVisible === index && ( // index -1 로 바꾸기, comment 내용 날리기
            <WriteCommentForm postId={post.id} handleComments={handleComments} index={index} />
          )}
          <CommentList postId={post.id} comments={likesAndComments[post.id]?.comments}></CommentList>
        </StyledPostBox>
      ))}
    </StyledContainer>
  );
};

export default MainPagePosts;

const StyledContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
`;

const StyledPostBox = styled.div`
  background-color: white;
  padding: 30px;
  margin: 30px 0;
  line-height: 25px;
  word-break: break-all;
  text-align: start;
  border-radius: 5px;
  cursor: default;

  &:hover {
    transition: 0.3s;
    transform: scale(1.02);
  }
`;
const StyledImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  margin-top: 15px;
  border-radius: 5px;
`;
