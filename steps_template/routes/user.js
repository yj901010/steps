/* 회원 관련 페이지 기능 구현 
- 기능 : 회원가입, 중복체크, 로그인, 회원탈퇴, 로그아웃, 회원검색 
*/

const express = require("express");
const router = express.Router();
const conn = require('../config/database');

// 회원가입 시, ID 중복체크
router.post('/checkId', (req,res)=>{
    console.log('ID중복체크 요청...', req.body);

    // 클라이언트로부터 전송된 ID
    const { id } = req.body;

    // DB 연동: 전송된 ID가 이미 데이터베이스에 존재하는지 확인
    const userIdCheck = 'SELECT user_id FROM users WHERE user_id = ?';
    conn.query(userIdCheck, [id], (err, rows) => {
        if (err) {
            console.error('ID 중복 체크 오류:', err);
            res.json({ result: 'error' });
        } else {
            // 데이터베이스에서 조회된 결과가 있으면 중복된 ID이므로 'dup'을 응답
            if (rows.length > 0) {
                res.json({ result: 'dup' });
            } else {
                // 조회된 결과가 없으면 중복되지 않은 ID이므로 'uniq'을 응답
                res.json({ result: 'uniq' });
            }
        }
    });
});


// 회원가입 라우터
router.post('/join', async (req, res) => {
    console.log('회원가입 요청...', req.body);

    const { id, pw, name, height, weight, birthdate } = req.body;
    const joined_at = new Date();

    const userJoin = 'insert into users (user_id, user_pw, user_name, user_height, user_weight, user_birthdate, joined_at) values (?, ?, ?, ?, ?, ?, ?)';
    const insertWalkingData = 'insert into walking (user_id, steps, distance, angle) values (?, ?, ?, ?)';
    const insertFsrData = 'insert into fsr_rf (user_id, created_at, press_value) values (?, ?, ?)';
    const insertMpu = 'insert into gyro_rf (user_id, created_at, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z) values(?, ?, ?, ?, ?, ?, ?, ?)';
    const temp = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    const jsonString = JSON.stringify(temp);


    try {
        // Perform user registration
        const userJoinResult = await queryPromise(userJoin, [id, pw, name, height, weight, birthdate, joined_at]);
        console.log('회원가입 완료');

        // Perform walking data insertion
        const walkingDataResult = await queryPromise(insertWalkingData, [id, 0, 0, 0]);
        console.log('walking 정보 입력 완료');

        const fsrDataResult = await queryPromise(insertFsrData, [id, joined_at, jsonString]);
        const mpuDataResult = await queryPromise(insertMpu, [id, joined_at, 0,0,0,0,0,0]);

        // Send success response after both operations are completed
        res.json({ result: 'success' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ result: 'error' });
    }
});

function queryPromise(query, values) {
    return new Promise((resolve, reject) => {
        conn.query(query, values, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}



// 로그인 라우터
router.post('/login', (req,res)=>{
    console.log('로그인 요청..', req.body);

    // DB연동코드 추가
    const {id, pw} = req.body;
    const sql = 'select user_id, user_name from users where user_id = ? and user_pw =?';
    conn.query(sql, [id, pw], (err, rows) => {
        console.log('err', err);
        console.log('rows', rows);
        if (rows.length > 0) {
            console.log('로그인 성공');
            res.json({ result: 'success', user: { id, name: rows[0].user_name } });
        }else {
            console.log('로그인 실패');
            res.json({ result: 'fail'});
        }
    })
    // 로그인 성공


    // 로그인 실패
    // res.json({result:'fail'});
});

// 로그아웃 라우터
//  - session을 server에 저장한 경우에는 해당 라우터로 와야함 (기존)
//  - session을 front에 저장한 경우에는 로그아웃을 react에서 설정 가능

// 회원정보 (비밀번호) 변경
router.post('/checkPw', (req,res)=>{
    console.log('비밀번호 변경 요청..', req.body);

    // DB연동코드 추가
    const {id, currentPw, changePw} = req.body;

    const matchPw = 'select * from users where user_id = ? and user_pw = ?';
    conn.query(matchPw, [id, currentPw], (err, rows) => {
        if(rows.length > 0){
            console.log('비밀번호 확인 완료');

            const modifyPw = 'update users set user_pw=? where user_id = ?';
            conn.query(modifyPw, [changePw, id], (err, rows) => {
                if(rows){
                    console.log('비밀번호 수정 성공');
                    res.json({result:'changed'});
                }else{
                    console.log('비밀번호 수정 실패');

                }
            })
        }else{
            console.log('비밀번호 확인해주세요!');
        }
    })

});

// 회원정보 (이름, 이메일) 수정
router.post('/modify', (req,res)=>{
    console.log('회원정보 수정 요청..', req.body);

    // DB연동코드 추가
    const {id, new_name, new_height, new_weight, new_birthdate} = req.body;

    const modifyUserInfo = 'update users set user_name = ?, user_height = ?, user_weight = ?, user_birthdate = ? where user_id = ?';
    conn.query(modifyUserInfo, [new_name, new_height, new_weight, new_birthdate, id], (err, rows) => {
        if(rows){
            console.log('회원정보 수정 완료');
            res.json({result:'success'});
        }else{
            console.log('회원정보 수정 실패');
        }
    })

});

// 회원 탈퇴 라우터
router.post('/delete', (req, res) => {
    console.log('회원탈퇴 요청..', req.body);

    const {id, pw} = req.body.userData;


    const deleteAccount = 'delete from users where user_id = ? and user_pw = ?';
    conn.query(deleteAccount, [id, pw], (err, rows) => {
        console.log(rows.affectedRows);
        if(rows.affectedRows){
            console.log('회원탈퇴 완료');
            res.json({result:'success'});
        }else{
            console.log('회원탈퇴 실패');
            res.json({result:'fail'});
        }
    })
});


// gyro 라우터
router.post(['/result'], async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);

    const user_Info = 'select user_id, user_name, user_height, user_weight, user_birthdate from users where user_id =?';
    const gyro_rf_Info = 'SELECT grf_idx, user_id, created_at, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z FROM gyro_rf WHERE user_id = ? AND grf_idx % 10 = 1';
    // const gyro_lf_Info = 'SELECT glf_idx, user_id, created_at, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z FROM gyro_lf WHERE user_id = ? AND glf_idx % 10 = 1';
    const fsr_rf_Info = 'select fr_idx, user_id, created_at, press_value from fsr_rf where user_id = ?';
    // const fsr_lf_Info = 'select fl_idx, user_id, created_at, press_value from fsr_lf where user_id = ?';
    const walking_Info = 'select walking_idx, user_id, steps, distance, angle from walking where user_id = ?';
    
    const userData = await queryDatabaseResult(user_Info, [id]);
    const gyroRfData = await queryDatabaseResult(gyro_rf_Info, [id]);
    // const gyroLfData = await queryDatabaseResult(gyro_lf_Info, [id]);
    const fsrRfData = await queryDatabaseResult(fsr_rf_Info, [id]);
    // const fsrLfData = await queryDatabaseResult(fsr_lf_Info, [id]);
    const walkingData = await queryDatabaseResult(walking_Info, [id]);

    if (userData.length >= 0 && walkingData.length >= 0 && gyroRfData.length >= 0 && fsrRfData.length >= 0 ) {
      console.log('user, walking, gyro_rf, gyro_lf, fsr_rf, fsr_lf 정보 확인 완료');
      res.json({ userData, walkingData, gyroRfData, fsrRfData }); // walkingData 추가
    } else {
      console.log('user, walking, gyro_rf, gyro_lf, fsr_rf 또는 fsr_lf 정보 확인 실패');
      res.json({ result: 'fail' });
    }
    
  } catch (error) {
    console.error('에러 발생:', error);
    res.status(500).json({ result: 'error' });
  }
});

router.post(['/survey'], async (req, res) => {
    try {
        const { id } = req.body;
        console.log(id);

        const user_Info = 'select user_id, user_name, user_height, user_weight, user_birthdate from users where user_id =?';
        const gyro_rf_Info = 'SELECT grf_idx, user_id, created_at, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z FROM gyro_rf WHERE user_id = ? AND grf_idx % 10 = 1';
        // const gyro_lf_Info = 'SELECT glf_idx, user_id, created_at, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z FROM gyro_lf WHERE user_id = ? AND glf_idx % 10 = 1';
        const fsr_rf_Info = 'select fr_idx, user_id, created_at, press_value from fsr_rf where user_id = ?';
        // const fsr_lf_Info = 'select fl_idx, user_id, created_at, press_value from fsr_lf where user_id = ?';

        const userData = await queryDatabaseResult(user_Info, [id]);
        const gyroRfData = await queryDatabaseResult(gyro_rf_Info, [id]);
        // const gyroLfData = await queryDatabaseResult(gyro_lf_Info, [id]);
        const fsrRfData = await queryDatabaseResult(fsr_rf_Info, [id]);
        // const fsrLfData = await queryDatabaseResult(fsr_lf_Info, [id]);

        if (userData.length > 0 && gyroRfData.length > 0 && fsrRfData.length >  0) {
            console.log('user, gyro_rf, fsr_rf 정보 확인 완료');
            res.json({ userData, gyroRfData, fsrRfData });
        } else {
            console.log('user, gyro_rf, fsr_rf 정보 확인 실패');
            res.json({ result: 'fail' });
        }

    } catch (error) {
        console.error('에러 발생:', error);
        res.status(500).json({ result: 'error' });
    }
});

function queryDatabaseResult(sql, params) {
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}


router.post('/video', (req,res)=>{
    console.log('영상 페이지 진입 완료', req.body);
});

router.post('/insertAllData', async (req, res) => {
  try {
    console.log('데이터 저장 시도 완료', req.body);
    const id = req.body.id;
    const [AcX, AcY, AcZ, GyX, GyY, GyZ] = req.body.mpu;
    const created_ad = new Date();
    const { fsrArray } = req.body;
    const jsonString = JSON.stringify(fsrArray);

    const insertFsrData = 'insert into fsr_rf (user_id, created_at, press_value) values (?, ?, ?)';
    const insertMpu = 'insert into gyro_rf (user_id, created_at, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z) values(?, ?, ?, ?, ?, ?, ?, ?)';

    // MPU 데이터 삽입
    const mpuResult = await queryDatabase(insertMpu, [id, created_ad, GyX, GyY, GyZ, AcX, AcY, AcZ]);

    if (mpuResult.result === 'fail') {
      console.log('MPU 데이터 DB 저장 실패');
      res.json({ result: 'fail' });
      return;
    }

    // FSR 데이터 삽입
    const fsrResult = await queryDatabase(insertFsrData, [id, created_ad, jsonString]);

    if (fsrResult.result === 'fail') {
      console.log('FSR 데이터 DB 저장 실패');
      res.json({ result: 'fail' });
      return;
    }

    console.log('데이터 저장 완료');
    res.json({ result: 'success' });
  } catch (error) {
    console.error('에러 발생:', error);
    res.status(500).json({ result: 'error' });
  }
});

function queryDatabase(sql, params) {
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, rows) => {
      if (err) {
        reject({ result: 'fail', error: err });
      } else {
        resolve({ result: 'success', data: rows });
      }
    });
  });
}


module.exports = router;