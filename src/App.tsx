import React, {useState, useEffect, useRef} from 'react';
import logo from './logo.svg';
import './App.css';
import ReactQuill from 'react-quill';

import "react-quill/dist/quill.snow.css"

function App() {

  const ref = useRef('')
  const chageRef = useRef(false)
  const chageCountRef = useRef(0)

  const [post, setPost] = useState<string[]>(()=>{
    const data = localStorage.getItem('data');

    try{

      if(data)
        return JSON.parse(data)
      return []
    }
    catch(e){
      localStorage.removeItem('data')
      return []
    }
  })
  const [content, setContent] = useState<string>(()=>{
    const tmp = localStorage.getItem('tmp');
    return tmp ?? ''
  })

  // 컨텐츠가 바뀔마다 로컬스토리지에 저장
  /*useEffect(() => {
    if(content.length > 0){
      localStorage.setItem('tmp', content);
    }
  }, [content]) */

  useEffect(()=>{
    chageCountRef.current++;
    ref.current = content;
    chageRef.current = true;
    if(chageCountRef.current > 15){
      chageCountRef.current = 0;
      chageRef.current = false;
      localStorage.setItem('tmp', content)
    }
  },[content])

  useEffect(()=>{
    const intv = setInterval(()=>{
      if(chageRef.current){
        localStorage.setItem('tmp', content)
        chageRef.current=false;
        chageCountRef.current=0;
      }
    },10000)
    return () => clearInterval(intv)
  }, [content])

  return (
    <div>
      <button onClick={()=>{
        if(content.length === 0){
          alert('아무것도 입력되지 않았습니다.')
          return;
        }
          localStorage.removeItem('tmp');
          localStorage.setItem('data', content)
          setPost(prev => {
            const rs = [...prev, content]
            localStorage.setItem('data', JSON.stringify(rs))
            return rs
          })
          setContent('');

      }}>
        발행
      </button>
      <button onClick={()=>{
        if(window.confirm('정말 초기화 하시겠습니까?'))
          localStorage.clear()
          setPost([])
      }}>
        전체제거
      </button>
      <ReactQuill 
        value={content}
        onChange={setContent}
        modules={{
          toolbar:{
            container:[            
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],               // custom button values
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
              [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
              [{ 'direction': 'rtl' }],                         // text direction
              [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['clean']   
            ]
          }
        }}
      />
      <div>
        {
          post.map((post, idx) => <div key={idx}>
            <div dangerouslySetInnerHTML={{
              __html:post
            }} />
          </div>)
        }
      </div>
    </div>
  );
}

export default App;
