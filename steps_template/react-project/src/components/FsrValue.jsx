import { Col, Row, Table, Button } from "reactstrap";
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import HeatMap from "./HeatMap";
import axios from "axios";

const socket = io('http://localhost:3001');

const FsrValue = () => {
  let user = JSON.parse(sessionStorage.getItem('user')) || null;

    const [heatmapData, setHeatmapData] = useState([]);
    const [fsrArray, setFsrArray] = useState([]);
    const [angleZ, setAnglez] = useState();
    const [resultText, setResultText] = useState('');
    const [mpu, setMpu] = useState([]);

    useEffect(() => {
        // 소켓 이벤트 리스너 등록
        socket.on('bluetoothData', (data) => {
            // 데이터 형식을 확인하고 적절히 파싱하여 2D 배열로 변환
            const parsedData = parseBluetoothData(data);
            setHeatmapData(parsedData);
            updateResultText(data.split(',').map(Number)[16]);

            axios.post('user/insertAllData', { fsrArray:data.split(',').map(Number).slice(0, 16), mpu:data.split(',').map(Number).slice(17, 23), id: user.id })
          .then((res) => {
            if (res.data.result === 'success') {
              console.log('데이터 저장 성공');
            } else {
              console.log('데이터 저장 실패');
            }
          });
        });

        return () => {
            // 컴포넌트 언마운트 시 소켓 이벤트 리스너 제거
            socket.off('bluetoothData');
        };
    }, []);

    const updateResultText = (data) => {
      if (data <= -25) {
          setResultText('팔자걸음');
      } else if (data >= 15) {
          setResultText('안짱걸음');
      } else {
          setResultText('정상');
      }
  };

    const parseBluetoothData = (data) => {
        // 문자열을 ','를 기준으로 분할하고 2D 배열로 변환
        const Array = data.split(',').map(Number);
        const dataArray = Array.slice(0, 16);
        setFsrArray(dataArray);
        setAnglez(Array[16]);
        setMpu(Array.slice(17,23));

        // 데이터를 주어진 형태에 맞게 재구성
        const rows = 6;
        const cols = 3;
        const parsedData = [];
        for (let i = 0; i < rows; i++) {
            let startIdx, endIdx;

            if (i === 0) {
                startIdx = 0;
                endIdx = 2;
            } else if (i === 1) {
                startIdx = 2;
                endIdx = 5;
            } else if (i === 2) {
                startIdx = 5;
                endIdx = 8;
            } else if (i === 3) {
                startIdx = 8;
                endIdx = 11;
            } else if (i === 4) {
                startIdx = 11;
                endIdx = 14;
            } else if (i === 5) {
                startIdx = 14;
                endIdx = 16;
            }
            
            parsedData.push(dataArray.slice(startIdx, endIdx));
          }
          
        return parsedData;
    };
    
    
    return (
      <div>
        <HeatMap/>
            <div style={{ textAlign: 'center' }}>
            <Button className="btn" color="success" style={{ width: '250px' }}>
                  측정
                </Button>
            </div>
            <br/>
            <br/>
            <div>
            <Table bordered striped style={{  textAlign: 'right'  }}>
              <th>압력값</th>
                <tbody>
              <tr>
                <td>{fsrArray[0]}</td>
                <td></td>
                <td>{fsrArray[1]}</td>
              </tr>
              <tr>
                <td>{fsrArray[2]}</td>
                <td>{fsrArray[3]}</td>
                <td>{fsrArray[4]}</td>
              </tr>
              <tr>
                <td>{fsrArray[5]}</td>
                <td>{fsrArray[6]}</td>
                <td>{fsrArray[7]}</td>
              </tr>
              <tr>
                <td>{fsrArray[8]}</td>
                <td>{fsrArray[9]}</td>
                <td>{fsrArray[10]}</td>
              </tr>
              <tr>
                <td>{fsrArray[11]}</td>
                <td>{fsrArray[12]}</td>
                <td>{fsrArray[13]}</td>
              </tr>
              <tr>
                <td>{fsrArray[14]}</td>
                <td></td>
                <td>{fsrArray[15]}</td>
              </tr>
            </tbody>
            </Table>
        </div>
        <div>
          <Table bordered striped>
            <thead>
              <th>
                현재 발의 기울기
              </th>
              </thead>
          <tbody>
            <tr>
              <td>
                값
              </td>
              <td>
                {angleZ}
              </td>
            </tr>
            <tr>
              <td>진단</td>
              <td>{resultText}</td>
            </tr>
          </tbody>
          </Table>
        </div>
      </div>
    );
};

export default FsrValue;