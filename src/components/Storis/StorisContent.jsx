import React, { useEffect, useState } from 'react';
import './Storis.css';
import Loading from '../UI/Loading/Loading';
import Stories from 'react-insta-stories';
import { IoClose } from "react-icons/io5";

const StorisContent = ({ data }) => {
  const [status, setStatus] = useState(false);
  const [view, setView] = useState(false);

  return (
    <>
      <div onClick={() => setStatus(true) || setView(true)} className="storis_content">
        <img style={{ border: view ? "2px solid transparent" : "2px solid var(--blue)" }} src={data.img} alt="" />
      </div>
      {status ? data ? (
        <div className="status">
          <IoClose onClick={() => setStatus(false)} className='close' />
          <Stories
            stories={data.stories}
            width={"100%"}
            height={"100vh"}
            onAllStoriesEnd={() => setStatus(false)}
          />
        </div>
      ) : (
        <div onClick={() => setStatus(false)} className="not_status">
          <Loading />
        </div>
      ) : ""
      }
    </>
  );
};

export default StorisContent;