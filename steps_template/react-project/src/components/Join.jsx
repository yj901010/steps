import React, { useEffect, useRef, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from '../axios'
import { Card, Row } from 'reactstrap';

const Join = () => {
  // useRef 초기화
  const idRef = useRef();
  const pwRef = useRef();
  const pw2Ref = useRef();
  const nameRef = useRef();
  const heightRef = useRef();
  const weightRef = useRef();
  const birthdateRef = useRef(); // 생년월일 추가

  // 사용자의 정보를 저장하는 state
  const [userData, setUserData] = useState({});
  const [text, setText] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);  // 비밀번호 일치 여부 상태 추가

  /* 입력된 값이 숫자이거나 백스페이스키인지 확인하는 함수 */
  const handleKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    // 숫자, 소수점, 백스페이스(46), Tap(9) 키 이외의 입력은 막습니다.
    if ((charCode < 48 || charCode > 57) && charCode !== 46 && charCode !== 8 && (event.keyCode === 9 || event.which === 9)) {
      event.preventDefault();
    }
  };

  /* 입력된 값이 소수점 이하 한 자리까지만 입력되도록 하는 함수 */
  const handleInput = (event) => {
    let value = event.target.value;

    // 숫자와 소수점 이외의 문자는 제거
    value = value.replace(/[^\d.]/g, '');

    event.target.value = value;
  };

  /* ID의 중복체크를 해주는 checkId 함수 구현 */
  const checkId = () => {
    axios
      .post('/user/checkId', { id: idRef.current.value })
      .then((res) => {
        if (res.data.result === 'dup') {
          setText('※ 사용 불가능한 아이디입니다. 다른 아이디를 입력해주세요.');
        } else {
          setText('※ 사용 가능한 아이디입니다.');
        }
      });
  };
  /* 비밀번호 확인 함수 */
  const handlePasswordMatch = () => {
    setPasswordMatch(pwRef.current.value === pw2Ref.current.value);
  };

  const handleJoin = (e) => {
    // 기본 이벤트 동작을 막는 함수
    e.preventDefault();
    console.log(idRef.current.value, pwRef.current.value);

    setUserData({
      id: idRef.current.value,
      pw: pwRef.current.value,
      name: nameRef.current.value,
      height: heightRef.current.value,
      weight: weightRef.current.value,
      birthdate: birthdateRef.current.value
    });
  }

  /*
    node.js 서버로 회원가입 정보를 보내는 useEffect 구현
    - 로그인되어 있는 상태인지 판별
    - 비밀번호1, 비밀번호2가 서로 같을 때 데이터 전송 시작 로직 구현
      -> 일치하지 않은 경우 : '※ 비밀번호가 일치하지 않습니다.' 출력(글자색은 빨간색)
  */
  useEffect(() => {
    if (userData.id !== undefined) {
      if (pwRef.current.value === pw2Ref.current.value) {
        axios
          .post('/user/join', {
            id: idRef.current.value,
            pw: pwRef.current.value,
            name: nameRef.current.value,
            height: heightRef.current.value,
            weight: weightRef.current.value,
            birthdate: birthdateRef.current.value
          })

          .then((res) => {
            console.log('요청성공', res.data);

            window.alert('회원가입 완료!');
            window.location.href = '/main';

          });
      }
    }
  }, [userData, passwordMatch]);

  return (
    <Row>
    <Card>
    <div>
      <h1>회원가입</h1>
      <hr />
      <Form onSubmit={handleJoin}>
        <Form.Group className="mb-3" controlId="formBasicId" style={{ width: 'auto', display: 'inline-block', marginRight: '10px' }}>
          <Form.Label>ID</Form.Label>
          <Form.Control type="text" placeholder="Enter ID" ref={idRef} />
        </Form.Group>

        <Button variant="light" style={{ marginBottom: '5px', backgroundColor: 'darkgray' }} onClick={checkId}>
          중복체크
        </Button>

        <br/>
        
        <span style={{ textAlign: 'center', justifyContent: 'center' }}>{text}</span>

        <br/>
        <br/>

        <Form.Group className="mb-3" controlId="formBasicPassWord1">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control type="password" placeholder="Enter Password" ref={pwRef} />
        </Form.Group>

        <br />

        <Form.Group className="mb-3" controlId="formBasicPassWord2">
          <Form.Label>비밀번호 확인</Form.Label>
          <Form.Control type="password" placeholder="Confirm Password" ref={pw2Ref} onChange={handlePasswordMatch} />
        </Form.Group>

        {!passwordMatch && <span> ※ 비밀번호가 일치하지 않습니다. </span>}

        <br />
        <br />

        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>이름</Form.Label>
          <Form.Control type="text" placeholder="Enter Name" ref={nameRef} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicHeight">
          <Form.Label>키 (cm)</Form.Label>
          <Form.Control type="text" placeholder="Enter Height" ref={heightRef} onKeyDown={handleKeyPress} onInput={handleInput} />
        </Form.Group>
        {/* <span> 소수점 한 자리수 까지만 입력해주세요.</span> */}

        <Form.Group className="mb-3" controlId="formBasicWeight">
          <Form.Label>몸무게 (kg)</Form.Label>
          <Form.Control type="text" placeholder="Enter Weight" ref={weightRef} onKeyDown={handleKeyPress} onInput={handleInput} />
        </Form.Group>
        {/* <span> 소수점 한 자리수 까지만 입력해주세요.</span> */}

        <Form.Group className="mb-3" controlId="formBasicBirthdate">
          <Form.Label>생년월일</Form.Label>
          <Form.Control type="date" ref={birthdateRef} />
        </Form.Group>

        <div className="d-grid gap mb-3" style={{ justifyContent: 'center', marginTop: '70px' }}>
          <Button variant="info" type="submit" style={{ border: 'none', width: '200px', backgroundColor: 'lightgreen' }}>
            회원가입
          </Button>
        </div>
      </Form>
    </div>
    </Card>
    </Row>
  );
};

export default Join