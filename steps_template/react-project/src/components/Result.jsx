import React from 'react'
import Starter from '../views/Starter'

const Result = () => {

  let user = JSON.parse(sessionStorage.getItem('user') || null);

  return (
    <div>
        {user?(
          <Starter/>   
        ):(<div>{alert('로그인후 이용 가능합니다.')} {window.location.href = '/main'}</div>)} 
    </div>
  )
}

export default Result